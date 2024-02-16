import {EmbedBuilder} from 'discord.js';
import {Account, MMR} from '../../../valorant/types/types';

export const TrackingPlayer = (
  player: Account,
  mmr: MMR,
  channel: `<#${string}>` | `<@${string}>` | undefined
) =>
  new EmbedBuilder()
    .setTitle(`${player.name}#${player.tag}`)
    .setDescription(`Tracking player in ${channel}!`)
    .setThumbnail(mmr.current_data.images.small)
    .setColor(0x90ee90)
    .setImage(`${player.card.wide}`)
    .setURL(
      encodeURI(
        `https://tracker.gg/valorant/profile/riot/${player.name}#${player.tag}/overview`
      ).replace('#', '%23')
    )
    .addFields([
      {
        name: 'Account Level',
        value: `${player.account_level}`,
        inline: true,
      },
      {
        name: 'Competitive Rank',
        value: `${mmr.current_data.currenttierpatched}`,
        inline: true,
      },
    ]);
