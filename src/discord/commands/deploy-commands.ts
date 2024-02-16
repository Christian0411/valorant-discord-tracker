import {REST, Routes} from 'discord.js';
import {discordToken, clientId} from '../../../config.json';
import {commands} from '.';

const commandsData = Object.values(commands).map(command => command.data);

const rest = new REST({version: '10'}).setToken(discordToken);

type DeployCommandsProps = {
  guildId: string;
};

export async function deployCommands({guildId}: DeployCommandsProps) {
  try {
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
      body: commandsData,
    });

    console.log('Successfully reloaded application (/) commands');
  } catch (error) {
    console.error(error);
  }
}
