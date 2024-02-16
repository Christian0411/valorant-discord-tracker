import { collections } from "../db";
import { DiscordBot } from "../discord/bot";
import { ValorantAPI } from "../valorant";
import config from '../../config.json'
import { MatchNotification } from "../discord/embeds/MatchNotification/MatchNotification";
import { TextChannel } from "discord.js";

export async function beginWatch(discord: DiscordBot, valapi: ValorantAPI) {
    watch(discord, valapi)
    setInterval(() => watch(discord, valapi), config.trackIntervalSeconds * 1000);
}

async function watch(discord: DiscordBot, valapi: ValorantAPI) {
    const trackedPlayers = await collections.players!.find({}).toArray();
    console.log(`Tracking ${trackedPlayers.length} player(s) every ${config.trackIntervalSeconds} seconds`)
    
    for (const player of trackedPlayers) {
        const match = await valapi.getLatestCompetitiveMatch({playerId: player.playerId})

        if (match.metadata.matchid != player.lastNotifiedMatchId) {
            console.log(`New match found for player: ${player.name}#${player.tag}`)
            
            // TODO: Save region to DB and pull region
            const mmr = await valapi.getMMRByPUUID({puuid: player.playerId, region: "na" })
            
            const progressAttachment = await valapi.getRankProgressImageAttachment(mmr.data)
            
            const matchNotificationEmbed = MatchNotification({match, attachment: progressAttachment.name!});
            
            for (const channelId of player.channelIds) {
                (discord.client.channels.cache.get(channelId) as TextChannel).send({
                    embeds: [matchNotificationEmbed], files: [progressAttachment]
                })
            }
            
            player.lastNotifiedMatchId = match.metadata.matchid
            
            await collections.players?.updateOne({playerId: player.playerId}, {$set: {...player}})
        }
    }
}

