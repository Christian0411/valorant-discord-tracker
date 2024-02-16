import {CommandInteraction, SlashCommandBuilder} from 'discord.js';
import {collections} from '../../../db';
import {RemovedPlayer} from '../../embeds/RemovedPlayer/RemovedPlayer';
import {PlayerNotFound} from '../../embeds/PlayerNotFound/PlayerNotFound';

export const data = new SlashCommandBuilder()
  .setName('remove')
  .setDescription('Stops tracking a player')
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

export async function execute(interaction: CommandInteraction) {
  const name = interaction.options.get('name', true).value as string;
  const tag = interaction.options.get('tag', true).value as string;

  const deleted = await collections.players?.findOneAndDelete({
    name: name.toLowerCase(),
    tag: tag,
  });

  if (!deleted)
    return await interaction.reply({embeds: [PlayerNotFound({name, tag})]});

  return await interaction.reply({embeds: [RemovedPlayer({name, tag})]});
}
