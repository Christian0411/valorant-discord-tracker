import {EmbedBuilder} from 'discord.js';
import {Match} from '../../../valorant/types/match';

export const MatchNotification = ({
  match,
  attachment,
}: {
  match: Match;
  attachment: string;
}) =>
  new EmbedBuilder()
    .setDescription(
      `[View match in tracker.gg](https://tracker.gg/valorant/match/${match.metadata.matchid})`
    )
    .setColor(match.metadata.has_won ? 0x90ee90 : 0xff0000)
    .setTimestamp(match.metadata.game_start * 1000)
    .setImage(`attachment://${attachment}`)
    .setAuthor({
      url: encodeURI(
        `https://tracker.gg/valorant/profile/riot/${match.players.me.name}#${match.players.me.tag}/overview`
      ).replace('#', '%23'),
      iconURL: `${match.players.me.assets.agent.small}`,
      name: `${match.players.me.name}#${match.players.me.tag}`,
    })
    .setFooter({text: `${match.metadata.mode} | ${match.metadata.map}`})
    .addFields([
      {
        name: 'Kills',
        value: `${match.players.me.stats.kills}`,
        inline: true,
      },
      {
        name: 'Deaths',
        value: `${match.players.me.stats.deaths}`,
        inline: true,
      },
      {
        name: 'Assists',
        value: `${match.players.me.stats.assists}`,
        inline: true,
      },
      {
        name: 'K/D',
        value: `${
          Math.round(
            (match.players.me.stats.kills / match.players.me.stats.deaths) * 100
          ) / 100
        }`,
        inline: true,
      },
      {
        name: 'HS%',
        value: `${match.players.me.stats.headshot_percent}%`,
        inline: true,
      },
      {
        name: 'ADR',
        value: `${match.players.me.stats.adr}`,
        inline: true,
      },
      {
        name: 'Team Placement',
        value: `${match.players.me.stats.placement}`,
        inline: true,
      },
      {
        name: `Match Score (${match.metadata.has_won ? 'Win' : 'Loss'})`,
        value: `${match.metadata.rounds_won} / ${match.metadata.rounds_lost}`,
        inline: true,
      },
    ]);
