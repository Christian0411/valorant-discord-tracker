import { collections } from "../db";
import { DiscordBot } from "../discord/bot";
import { ValorantAPI } from "../valorant";
import config from '../../config.json'
import { MatchNotification } from "../discord/embeds/MatchNotification/MatchNotification";
import { TextChannel } from "discord.js";


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
        const match = await valapi.getLatestCompetitiveMatch({playerId: player.playerId})

        if (match.metadata.matchid != player.lastNotifiedMatchId) {
            console.log(`New match found for player: ${player.name}#${player.tag}`)
            
            // TODO: Save region to DB and pull region
            const mmr = await valapi.getMMRByPUUID({puuid: player.playerId, region: "na" })
            const progressAttachment = await valapi.getRankProgressImageAttachment(mmr.data)

            if (datesWithin(3, new Date(), player.updatedAt)) {
                // Game was played within the same session, update session RR
                player.sessionRR = player.sessionRR + mmr.data.current_data.mmr_change_to_last_game;
            } else {
                player.sessionRR = mmr.data.current_data.mmr_change_to_last_game
            }
            
            const matchNotificationEmbed = MatchNotification({player, match, attachment: progressAttachment.name!});
            
            for (const channelId of player.channelIds) {
                (discord.client.channels.cache.get(channelId) as TextChannel).send({
                    embeds: [matchNotificationEmbed], files: [progressAttachment]
                })
            }
            
            player.lastNotifiedMatchId = match.metadata.matchid
            player.updatedAt = new Date();
            
            await collections.players?.updateOne({playerId: player.playerId}, {$set: {...player}})
        }
    }
}

