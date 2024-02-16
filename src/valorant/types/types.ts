import {ErrorObject, RateLimit, Regions} from 'unofficial-valorant-api';

export type Modify<T, R> = Omit<T, keyof R> & R;

export interface Account {
  puuid: string;
  region: Regions;
  account_level: number;
  name: string;
  tag: string;
  card: {
    small: string;
    large: string;
    wide: string;
    id: string;
  };
  last_update: string;
  last_update_raw: number;
}

export type RankName =
  | 'unrated'
  | 'Iron 1'
  | 'Iron 2'
  | 'Iron 3'
  | 'Bronze 1'
  | 'Bronze 2'
  | 'Bronze 3'
  | 'Silver 1'
  | 'Silver 2'
  | 'Silver 3'
  | 'Gold 1'
  | 'Gold 2'
  | 'Gold 3'
  | 'Platinum 1'
  | 'Platinum 2'
  | 'Platinum 3'
  | 'Diamond 1'
  | 'Diamond 2'
  | 'Diamond 3'
  | 'Ascendant 1'
  | 'Ascendant 2'
  | 'Ascendant 3'
  | 'Immportal 1'
  | 'Immportal 2'
  | 'Immportal 3'
  | 'Radiant';

export type Season =
  | 'e1a1'
  | 'e1a2'
  | 'e1a3'
  | 'e2a1'
  | 'e2a2'
  | 'e2a3'
  | 'e3a1'
  | 'e3a2'
  | 'e3a3'
  | 'e4a1'
  | 'e4a2'
  | 'e4a3'
  | 'e5a1'
  | 'e5a2'
  | 'e5a3'
  | 'e6a1'
  | 'e6a2'
  | 'e6a3'
  | 'e7a1'
  | 'e7a2'
  | 'e7a3'
  | 'e8a1'
  | 'e8a2'
  | 'e8a3'
  | string;

export const rankColors: {[index: string]: string} = {
  immortal: '#a54150',
  ascendant: '#438956',
  diamond: '#b371d0',
  platinum: '#81bcaf',
  gold: '#e7d46e',
  silver: '#b5b5b5',
  bronze: '#96805E',
  iron: '#323232',
};

export interface MMR {
  name: string;
  tag: string;
  current_data: {
    currenttier: number;
    currenttierpatched: RankName;
    images: {
      small: string;
      large: string;
      triangle_down: string;
      triangle_up: string;
    };
    ranking_in_tier: number;
    mmr_change_to_last_game: number;
    elo: number;
    games_needed_for_rating: number;
    old: boolean;
  };
  highest_rank: {
    old: boolean;
    tier: number;
    patched_tier: RankName;
    season: Season;
    converted: number;
  };
  by_season: {
    [key: Season]: {
      error?: string;
      wins: number;
      number_of_games: number;
      final_rank: number;
      final_rank_patched: RankName;
      act_rank_wins: [
        {
          patched_tier: RankName;
          tier: number;
        },
      ];
      old: boolean;
    };
  };
}

export interface APIResponse<T> {
  status: number;
  data: T;
  ratelimits: RateLimit;
  error: ErrorObject | null;
}
