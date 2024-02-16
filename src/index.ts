import {connectToDatabase} from './db';
import {DiscordBot} from './discord/bot';
import {ValorantAPI} from './valorant';
import {beginWatch} from './tracker/tracker';

connectToDatabase().then(async () => {
  const valapi = new ValorantAPI();
  const bot = new DiscordBot(valapi);
  await bot.login();
  beginWatch(bot, valapi);
});
