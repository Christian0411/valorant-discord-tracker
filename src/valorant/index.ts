import HenrikDevValorantAPI, {
  AccountFetchOptions,
  ErrorObject,
  MMRVersions,
  RateLimit,
  getMMRByPUUIDFetchOptions,
} from 'unofficial-valorant-api';
import {APIResponse, Account, MMR, Modify, rankColors} from './types/types';
import config from '../../config.json';
import {Match, Player} from './types/match';
import nodeHtmlToImage from 'node-html-to-image';
import {readFileSync} from 'fs';
import {AttachmentBuilder} from 'discord.js';

export class ValorantAPI extends HenrikDevValorantAPI {
  constructor() {
    super(config.valorantAPIToken);
  }

  public async getAccount(
    options: AccountFetchOptions
  ): Promise<APIResponse<Account>> {
    try {
      const response = await super.getAccount(options);

      if (response.status === 404) {
        console.warn(
          `Valorant account ${options.name}#${options.tag} does not exist.`
        );
      }

      return response as APIResponse<Account>;
    } catch (e) {
      console.error('ValorantAPI Error: %s', e);
      throw e;
    }
  }

  public async getMMRByPUUID({
    version = 'v2',
    region,
    puuid,
    filter,
  }: Modify<getMMRByPUUIDFetchOptions, {version?: MMRVersions}>): Promise<
    APIResponse<MMR>
  > {
    try {
      const response = await super.getMMRByPUUID({
        region,
        puuid,
        filter,
        version,
      });
      return response as APIResponse<MMR>;
    } catch (e) {
      console.error('ValorantAPI Error: %s', e);
      throw e;
    }
  }

  public async getLatestCompetitiveMatch({
    playerId,
  }: {
    playerId: string;
  }): Promise<Match> {
    const {
      data: [match],
    } = (await super.getMatchesByPUUID({
      region: 'na',
      puuid: playerId,
      size: 1,
      filter: 'competitive',
    })) as APIResponse<Array<Match>>;

    match.players.me = match.players.all_players.find(
      player => player.puuid === playerId
    )!;
    const winning_team = match.teams.red.has_won ? 'Red' : 'Blue';
    match.metadata.has_won = match.players.me.team === winning_team;
    match.metadata.rounds_won =
      match.teams[match.players.me.team.toLowerCase()].rounds_won;
    match.metadata.rounds_lost =
      match.teams[match.players.me.team.toLowerCase()].rounds_lost;
    match.players.me.stats.headshot_percent = Math.round(
      (match.players.me.stats.headshots /
        (match.players.me.stats.headshots +
          match.players.me.stats.legshots +
          match.players.me.stats.bodyshots)) *
        100
    );
    match.players.me.stats.adr = Math.round(
      match.players.me.damage_made /
        (match.metadata.rounds_won + match.metadata.rounds_lost)
    );
    match.players.me.stats.placement = this.getPlacementInMatch(match);

    return match;
  }

  public async getRankProgressImageAttachment(mmr: MMR) {
    const htmlRawData = readFileSync('./src/rankattachment/rankattachment.hbs');
    const mmrChange = mmr.current_data.mmr_change_to_last_game;
    const barValuePercent = (mmr.current_data.ranking_in_tier / 100) * 100;
    const rankColor = this.getRankColorFromTierName(
      mmr.current_data.currenttierpatched.toLowerCase()
    );

    await nodeHtmlToImage({
      output: './src/rankattachment/attachment.png',
      content: {
        currentTier: mmr.current_data.currenttierpatched.toUpperCase(),
        rankingInTier: mmr.current_data.ranking_in_tier,
        rankIconUrl: mmr.current_data.images.small,
        barValuePercent,
        didGainRR: mmr.current_data.mmr_change_to_last_game > 0,
        mmrChange:
          mmr.current_data.mmr_change_to_last_game > 0
            ? `+${mmrChange}`
            : `${mmrChange}`,
        rankColor,
      },
      html: htmlRawData.toString(),
      selector: '#screenshot',
      puppeteerArgs: {executablePath: '/usr/bin/chromium'},
    });

    return new AttachmentBuilder('./src/rankattachment/attachment.png', {
      name: 'attachment.png',
    });
  }

  getRankColorFromTierName(tierName: string) {
    return rankColors[tierName.split(' ')[0]];
  }
  getPlacementInMatch(match: Match) {
    const players = match.players[match.players.me.team.toLowerCase()];
    if (Array.isArray(players)) {
      const playersSorted = players.sort(
        (p1, p2) => p2.stats.score - p1.stats.score
      );
      const index = playersSorted.findIndex(
        player => player.puuid === match.players.me.puuid
      );
      return index + 1;
    } else {
      throw new Error('Player team is not array');
    }
  }
}
