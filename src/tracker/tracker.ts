import { collections } from "../db";
import { DiscordBot } from "../discord/bot";
import { ValorantAPI } from "../valorant";
import config from '../../config.json'
import { MatchNotification, MatchNotificationStats } from "../discord/embeds/MatchNotification/MatchNotification";
import { TextChannel } from "discord.js";
import { Color } from "../discord/markdown";
import TrackedPlayer from "../db/models/TrackedPlayer";
import { Match } from "../valorant/types/match";
import { Stat } from "../db/models/Stat";
import { MMR } from "../valorant/types/types";


function datesWithin(withinHours: number, date1: Date, date2: Date): boolean {
    // Calculate the difference in milliseconds
    const difference = Math.abs(date1.getTime() - date2.getTime());

    // Convert milliseconds to hours
    const hours = difference / (1000 * 60 * 60);

    // Check if the difference is less than or equal to 3 hours
    return hours <= withinHours;
}

export async function beginWatch(discord: DiscordBot, valapi: ValorantAPI) {
    watch(discord, valapi)
    setInterval(() => watch(discord, valapi), config.trackIntervalSeconds * 1000);
}

async function watch(discord: DiscordBot, valapi: ValorantAPI) {
    const trackedPlayers = await collections.players!.find({}).toArray();
    console.log(`Tracking ${trackedPlayers.length} player(s) every ${config.trackIntervalSeconds} seconds`)

    for (const player of trackedPlayers) {
        const match = await valapi.getLatestCompetitiveMatch({ playerId: player.playerId })

        if (match.metadata.matchid != player.lastNotifiedMatchId) {
            console.log(`New match found for player: ${player.name}#${player.tag}`)

            // TODO: Save region to DB and pull region
            const mmr = await valapi.getMMRByPUUID({ puuid: player.playerId, region: "na" })
            const progressAttachment = await valapi.getRankProgressImageAttachment(mmr.data)

            if (datesWithin(3, new Date(), player.updatedAt)) {
                // Game was played within the same session, update session RR
                player.sessionRR = player.sessionRR + mmr.data.current_data.mmr_change_to_last_game;
            } else {
                player.sessionRR = mmr.data.current_data.mmr_change_to_last_game
            }

            const stats = buildStats(player, match, mmr.data)

            const matchNotificationEmbed = MatchNotification({ player, match, stats, attachment: progressAttachment.name! });

            for (const channelId of player.channelIds) {
                (discord.client.channels.cache.get(channelId) as TextChannel).send({
                    embeds: [matchNotificationEmbed], files: [progressAttachment]
                })
            }

            await saveUpdatedPlayer(player, match)
        }
    }

}


async function saveUpdatedPlayer(player: TrackedPlayer, match: Match) {
    player.lastNotifiedMatchId = match.metadata.matchid
    player.updatedAt = new Date();

    const kd = Math.round(
        (match.players.me.stats.kills / match.players.me.stats.deaths) * 100
    ) / 100;

    player.stats.kd.average = calculateNewAverage(player.stats.kd, kd)
    player.stats.kd.count = player.stats.kd.count + 1
    player.stats.kd.best = Math.max(kd, player.stats.kd.best)


    player.stats.hs.average = calculateNewAverage(player.stats.hs, match.players.me.stats.headshot_percent!)
    player.stats.hs.count = player.stats.hs.count + 1
    player.stats.hs.best = Math.max(match.players.me.stats.headshot_percent!, player.stats.hs.best)

    await collections.players?.updateOne({ playerId: player.playerId }, { $set: { ...player } })
}


function calculateNewAverage({ average, count }: Stat, value: number) {
    if (count == 0) return value
    return average + ((value - average) / count)
}

function buildStats(player: TrackedPlayer, match: Match, mmr: MMR) {
    const kd = Math.round(
        (match.players.me.stats.kills / match.players.me.stats.deaths) * 100
    ) / 100;

    const seasons = Object.values(mmr.by_season)
    // current season is the penultimate in this list, may change for act 3?
    const currentSeason = seasons[seasons.length - 2];

    const winrate = currentSeason.wins / currentSeason.number_of_games * 100;

    const stats: MatchNotificationStats = {
        kills: { stat: match.players.me.stats.kills },
        deaths: { stat: match.players.me.stats.deaths },
        assists: { stat: match.players.me.stats.assists },
        kd: {
            stat: kd,
            color: determineStatColor(player.stats.kd, kd)
        },
        hs: { stat: `${match.players.me.stats.headshot_percent}%`, color: determineStatColor(player.stats.hs, match.players.me.stats.headshot_percent!) },
        winrate: { stat: `${winrate}%`, color: winrate > 50 ? Color.Green : Color.Red },
        placement: { stat: match.players.me.stats.placement! },
        score: { stat: `${match.metadata.rounds_won}/${match.metadata.rounds_lost}`, color: match.metadata.has_won ? Color.Green : Color.Red },
        sessionRR: { stat: `${player.sessionRR} RR` }
    }

    return stats
}

function determineStatColor({ average, best }: Stat, matchStat: number) {
    if (matchStat > best) return Color.Gold
    if (matchStat > average) return Color.Green
    if (matchStat < average) return Color.Red
    return Color.None
}

