import {CommandInteraction, SlashCommandBuilder} from 'discord.js';
import {collections} from '../../../db';
import {TrackedPlayers} from '../../embeds/TrackedPlayers/TrackedPlayers';

export const data = new SlashCommandBuilder()
  .setName('list')
  .setDescription('Lists the players being tracked');

export async function execute(interaction: CommandInteraction) {
  const players = await collections.players!.find({}).toArray();

  return await interaction.reply({embeds: [TrackedPlayers(players)]});
}
