import {EmbedBuilder} from 'discord.js';

export const RemovedPlayer = ({name, tag}: {name: string; tag: string}) =>
  new EmbedBuilder()
    .setTitle('Player removed')
    .setDescription(`Player ${name}#${tag} is no longer being tracked.`)
    .setColor(0xff0000);
