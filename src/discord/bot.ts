// Require the necessary discord.js classes
import {
  Client,
  Collection,
  Events,
  GatewayIntentBits,
  CommandInteraction,
  InteractionResponse,
} from 'discord.js';
import {discordToken, guildId} from '../../config.json';
import {deployCommands} from './commands/deploy-commands';
import {commands} from './commands';
import {ValorantAPI} from '../valorant';

export class DiscordBot {
  client: Client;
  commands: Collection<
    string,
    (interaction: CommandInteraction) => Promise<InteractionResponse<boolean>>
  > = new Collection();
  valapi: ValorantAPI;

  constructor(valapi: ValorantAPI) {
    this.client = new Client({intents: [GatewayIntentBits.Guilds]});

    this.client.on('guildCreate', async guild => {
      await deployCommands({guildId: guild.id});
    });

    this.initCommands();
    this.valapi = valapi;
  }

  async login() {
    this.client.login(discordToken);
    return new Promise((resolve) => {
      this.client.once(Events.ClientReady, async readyClient => {
        console.log(`Ready! Logged in as ${readyClient.user.tag}`);
        // Reload commands for test guild on startup
        await deployCommands({guildId});

        resolve(true);
      });
    });
  }
  initCommands() {
    this.client.on(Events.InteractionCreate, async interaction => {
      if (!interaction.isCommand()) {
        return;
      }
      const {commandName} = interaction;
      if (commands[commandName as keyof typeof commands]) {
        commands[commandName as keyof typeof commands].execute(
          interaction,
          this.valapi
        );
      }
    });
  }
}
