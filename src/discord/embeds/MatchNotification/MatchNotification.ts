import { EmbedBuilder } from 'discord.js';
import { Match } from '../../../valorant/types/match';
import TrackedPlayer from '../../../db/models/TrackedPlayer';

/* Example
\`\`\`ansi
Kills             Deaths             Assists
[2;32m22[0m                [2;33m10[0m                 14

K/D               HS                 ADR
[2;31m1.38[0m              [2;31m13%[0m                12

Team Placement    Match Score(Win)   Session
[2;32m1[0m                 13 / 9             29
\`\`\`
*/

function stripAnsi(str: string): string {
  return str.replace(/\x1b\[[0-9;]*m/g, '');
}

const buildStatTable = (table: string[][]) => {

  // Determine the Maximum Visual Length for Each Column
  let maxLengths: number[] = table[0].map((_, colIndex) =>
    Math.max(...table.map(row => stripAnsi(row[colIndex]).length))
  );
  // Correctly Pad Each Item and Format Rows with Additional Space
let formattedRows: string[] = table.map(row => 
  row.map((item, index) => 
    item + ' '.repeat(maxLengths[index] - stripAnsi(item).length + 4) // Apply padding based on visual length
  ).join("")
);


  // Step 3: Join All Rows with Newline Character
  let formattedTable: string = formattedRows.join("\n");

  // Display the formatted table
  return `\`\`\`ansi\n${formattedTable}\n\`\`\``
}

export const MatchNotification = ({
  player,
  match,
  attachment,
}: {
  player: TrackedPlayer,
  match: Match;
  attachment: string;
}) =>
  new EmbedBuilder()
    .setDescription(
      buildStatTable([
        ["Kills", "Deaths", "Assists"],
        ["22", "10", "14"],
        [" ", " ", " "],
        ["K/D", "HS", "ADR"],
        [`[2;31m1.38[0m`, "25%", "327"],
        [" ", " ", " "],
        ["Placement", "Score", "Session"],
        ["1", "13 / 9", "29"]
      ])
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
// .addFields([
//   {
//     name: 'Kills',
//     value: `${match.players.me.stats.kills}`,
//     inline: true,
//   },
//   {
//     name: 'Deaths',
//     value: `${match.players.me.stats.deaths}`,
//     inline: true,
//   },
//   {
//     name: 'Assists',
//     value: `${match.players.me.stats.assists}`,
//     inline: true,
//   },
//   {
//     name: 'K/D',
//     value: `${
//       Math.round(
//         (match.players.me.stats.kills / match.players.me.stats.deaths) * 100
//       ) / 100
//     }`,
//     inline: true,
//   },
//   {
//     name: 'HS%',
//     value: `${match.players.me.stats.headshot_percent}%`,
//     inline: true,
//   },
//   {
//     name: 'ADR',
//     value: `\`\`\`ansi
//     [2;31m12[0m[0;2m[0m
//     \`\`\``,
//     inline: true,
//   },
//   {
//     name: 'Team Placement',
//     value: `${match.players.me.stats.placement}`,
//     inline: true,
//   },
//   {
//     name: `Match Score (${match.metadata.has_won ? 'Win' : 'Loss'})`,
//     value: `${match.metadata.rounds_won} / ${match.metadata.rounds_lost}`,
//     inline: true,
//   },
//   {
//     name: `Session RR`,
//     value: `${player.sessionRR}`,
//     inline: true,
//   }
// ]);
