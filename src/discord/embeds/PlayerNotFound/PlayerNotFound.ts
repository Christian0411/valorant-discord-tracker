import {EmbedBuilder} from 'discord.js';

export const PlayerNotFound = ({name, tag}: {name: string; tag: string}) =>
  new EmbedBuilder()
    .setTitle('Error')
    .setDescription(`Player ${name}#${tag} could not be found.`)
    .setColor(0xff0000)
    .setThumbnail('https://i.imgur.com/LQNmRjL.png');
