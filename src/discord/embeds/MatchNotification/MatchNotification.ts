import { EmbedBuilder } from 'discord.js';
import { Match } from '../../../valorant/types/match';
import TrackedPlayer from '../../../db/models/TrackedPlayer';
import { Color, buildMarkdownTable, colorize as color, spacer } from '../../markdown';

interface NotificationStat {
  stat: string | number, 
  color?: Color
}

export interface MatchNotificationStats {
  kills: NotificationStat,
  deaths: NotificationStat,
  assists: NotificationStat,
  kd: NotificationStat,
  hs: NotificationStat,
  winrate: NotificationStat,
  placement: NotificationStat,
  score: NotificationStat,
  sessionRR: NotificationStat,
}

function colorize(stat: NotificationStat) {
  return color(stat.stat, stat.color)
}

export const MatchNotification = ({
  player,
  match,
  attachment,
  stats,
}: {
  player: TrackedPlayer,
  match: Match;
  attachment: string;
  stats: MatchNotificationStats;
}) => {

  const trackerLink = `[View match in tracker.gg](https://tracker.gg/valorant/match/${match.metadata.matchid})`
  const statsTable = buildMarkdownTable([
    ["Kills", "Deaths", "Assists"],
    [colorize(stats.kills), colorize(stats.deaths), colorize(stats.assists)],
    spacer(3),
    ["K/D", "HS", "Win%"],
    [colorize(stats.kd), colorize(stats.hs), colorize(stats.winrate)],
    spacer(3),
    ["Placement", "Score", "Session"],
    [colorize(stats.placement), colorize(stats.score), colorize(stats.sessionRR)]
  ])

  return new EmbedBuilder()
    .setDescription(
      trackerLink + "\n" + statsTable
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
    .setFooter({ text: `${match.metadata.mode} | ${match.metadata.map}` })
  }