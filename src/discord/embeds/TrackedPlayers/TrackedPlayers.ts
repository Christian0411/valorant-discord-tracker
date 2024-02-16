import {EmbedBuilder} from 'discord.js';
import Player from '../../../db/models/TrackedPlayer';
import {WithId} from 'mongodb';

export const TrackedPlayers = (players: WithId<Player>[]) => {
  const description = `${
    players.length === 0 ? 'No players tracked.' : ''
  } Use the \`/track\` command to add more players`;

  const embed = new EmbedBuilder()
    .setTitle('Currently tracked players')
    .setDescription(description)
    .setColor(0x90ee90);

  for (const player of players) {
    const fields = [
      {
        name: 'Player Name',
        value: `[${player.name}#${player.tag}](${encodeURI(
          `https://tracker.gg/valorant/profile/riot/${player.name}#${player.tag}/overview`
        ).replace('#', '%23')})`,
        inline: true,
      },
      {
        name: 'Latest Match',
        value: `[Match](${encodeURI(
          `https://tracker.gg/valorant/match/${player.lastNotifiedMatchId}`
        )})`,
        inline: true,
      },
      {
        name: '\b',
        value: '\b',
        inline: true,
      },
    ];
    embed.addFields(fields);
  }
  return embed;
};
