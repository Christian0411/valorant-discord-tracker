import {CommandInteraction, SlashCommandBuilder} from 'discord.js';
import {ValorantAPI} from '../../../valorant';
import {PlayerNotFound} from '../../embeds/PlayerNotFound/PlayerNotFound';
import {collections} from '../../../db';
import {TrackingPlayer} from '../../embeds/TrackingPlayer/TrackingPlayer';

export const data = new SlashCommandBuilder()
  .setName('track')
  .setDescription('Adds a person to track in the #valorant channel')
  .addStringOption(option =>
    option
      .setName('name')
      .setDescription('The users valorant name')
      .setRequired(true)
  )
  .addStringOption(option =>
    option
      .setName('tag')
      .setDescription('The users valorant tag')
      .setRequired(true)
  );

export async function execute(
  interaction: CommandInteraction,
  valapi: ValorantAPI
) {
  await interaction.deferReply();
  const name = interaction.options.get('name', true).value as string;
  const tag = interaction.options.get('tag', true).value as string;

  const {data: player} = await valapi.getAccount({name, tag});

  if (!player) {
    return await interaction.editReply({embeds: [PlayerNotFound({name, tag})]});
  }

  const playerMMR = await valapi.getMMRByPUUID({
    puuid: player.puuid,
    region: player.region,
  });
  const alreadyTrackedPlayer = await collections.players?.findOne({
    playerId: player.puuid,});

  if (alreadyTrackedPlayer) {
    // Player is being tracked but added to a new channel
    if (!(interaction.channelId in alreadyTrackedPlayer.channelIds)) {
      collections.players?.updateOne(
        {playerId: alreadyTrackedPlayer.playerId},
        {
          $set: {
            channelIds: [
              ...alreadyTrackedPlayer.channelIds,
              interaction.channelId,
            ],
          },
        }
      );
    }
  } else {
    collections.players?.insertOne({
      lastNotifiedMatchId: '',
      name: player.name.toLowerCase(),
      tag: player.tag,
      playerId: player.puuid,
      channelIds: [interaction.channelId],
      updatedAt: new Date(),
      sessionRR: 0,
      stats: {
        kd: {
          average: 0,
          best: 0,
          count: 0
        },
        hs: {
          average: 0,
          best: 0,
          count: 0
        }
      }
    });
  }

  return await interaction.editReply({
    embeds: [
      TrackingPlayer(player, playerMMR.data, interaction.channel?.toString()),
    ],
  });
}
