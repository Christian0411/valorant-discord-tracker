import {RankName} from './types';

type TeamMetadata = {
  has_won: boolean;
  rounds_won: number;
  rounds_lost: number;
  roster: any;
};

export interface Player {
  puuid: string;
  name: string;
  tag: string;
  team: string;
  level: number;
  character: string;
  currenttier: number;
  currenttier_patched: RankName;
  player_card: string;
  player_title: string;
  party_id: string;
  session_playtime: {
    minutes: number;
    seconds: number;
    milliseconds: number;
  };
  behavior: {
    afk_rounds: number;
    friendly_fire: {
      incoming: number;
      outgoing: number;
    };
    rounds_in_spawn: number;
  };
  platform: {
    type: string;
    os: {
      name: string;
      version: string;
    };
  };
  ability_casts: {
    c_cast: number;
    q_cast: number;
    e_cast: number;
    x_cast: number;
  };
  assets: {
    card: {
      small: string;
      large: string;
      wide: string;
    };
    agent: {
      small: string;
      bust: string;
      full: string;
      killfeed: string;
    };
  };
  stats: {
    adr?: number;
    score: number;
    kills: number;
    deaths: number;
    assists: number;
    bodyshots: number;
    headshots: number;
    legshots: number;
    headshot_percent?: number;
    placement?: number;
  };
  economy: {
    spent: {
      overall: number;
      average: number;
    };
    loadout_value: {
      overall: number;
      average: number;
    };
  };
  damage_made: number;
  damage_received: number;
}

export type Match = {
  metadata: {
    has_won: boolean;
    map: string;
    game_version: string;
    game_length: number;
    game_start: number;
    game_start_patched: string;
    rounds_played: number;
    mode: string;
    mode_id: string;
    queue: string;
    season_id: string;
    platform: string;
    matchid: string;
    premier_info: {
      tournament_id: any;
      matchup_id: any;
    };
    region: string;
    rounds_lost: number;
    rounds_won: number;
    cluster: string;
  };
  players: {
    [index: string]: Array<Player> | Player;
    me: Player;
    all_players: Array<Player>;
    red: Array<Player>;
    blue: Array<Player>;
  };
  observers: Array<any>;
  coaches: Array<any>;
  teams: {
    [index: string]: TeamMetadata;
    red: {
      has_won: boolean;
      rounds_won: number;
      rounds_lost: number;
      roster: any;
    };
    blue: {
      has_won: boolean;
      rounds_won: number;
      rounds_lost: number;
      roster: any;
    };
  };
  rounds: Array<{
    winning_team: string;
    end_type: string;
    bomb_planted: boolean;
    bomb_defused: boolean;
    plant_events: {
      plant_location?: {
        x: number;
        y: number;
      };
      planted_by?: {
        puuid: string;
        display_name: string;
        team: string;
      };
      plant_site?: string;
      plant_time_in_round?: number;
      player_locations_on_plant?: Array<{
        player_puuid: string;
        player_display_name: string;
        player_team: string;
        location: {
          x: number;
          y: number;
        };
        view_radians: number;
      }>;
    };
    defuse_events: {
      defuse_location?: {
        x: number;
        y: number;
      };
      defused_by?: {
        puuid: string;
        display_name: string;
        team: string;
      };
      defuse_time_in_round?: number;
      player_locations_on_defuse?: Array<{
        player_puuid: string;
        player_display_name: string;
        player_team: string;
        location: {
          x: number;
          y: number;
        };
        view_radians: number;
      }>;
    };
    player_stats: Array<{
      ability_casts: {
        c_casts: any;
        q_casts: any;
        e_cast: any;
        x_cast: any;
      };
      player_puuid: string;
      player_display_name: string;
      player_team: string;
      damage_events: Array<{
        receiver_puuid: string;
        receiver_display_name: string;
        receiver_team: string;
        bodyshots: number;
        damage: number;
        headshots: number;
        legshots: number;
      }>;
      damage: number;
      bodyshots: number;
      headshots: number;
      legshots: number;
      kill_events: Array<{
        kill_time_in_round: number;
        kill_time_in_match: number;
        killer_puuid: string;
        killer_display_name: string;
        killer_team: string;
        victim_puuid: string;
        victim_display_name: string;
        victim_team: string;
        victim_death_location: {
          x: number;
          y: number;
        };
        damage_weapon_id: string;
        damage_weapon_name?: string;
        damage_weapon_assets: {
          display_icon?: string;
          killfeed_icon?: string;
        };
        secondary_fire_mode: boolean;
        player_locations_on_kill: Array<{
          player_puuid: string;
          player_display_name: string;
          player_team: string;
          location: {
            x: number;
            y: number;
          };
          view_radians: number;
        }>;
        assistants: Array<{
          assistant_puuid: string;
          assistant_display_name: string;
          assistant_team: string;
        }>;
      }>;
      kills: number;
      score: number;
      economy: {
        loadout_value: number;
        weapon: {
          id: string;
          name: string;
          assets: {
            display_icon: string;
            killfeed_icon: string;
          };
        };
        armor: {
          id?: string;
          name?: string;
          assets: {
            display_icon?: string;
          };
        };
        remaining: number;
        spent: number;
      };
      was_afk: boolean;
      was_penalized: boolean;
      stayed_in_spawn: boolean;
    }>;
  }>;
  kills: Array<{
    kill_time_in_round: number;
    kill_time_in_match: number;
    round: number;
    killer_puuid: string;
    killer_display_name: string;
    killer_team: string;
    victim_puuid: string;
    victim_display_name: string;
    victim_team: string;
    victim_death_location: {
      x: number;
      y: number;
    };
    damage_weapon_id: string;
    damage_weapon_name?: string;
    damage_weapon_assets: {
      display_icon?: string;
      killfeed_icon?: string;
    };
    secondary_fire_mode: boolean;
    player_locations_on_kill: Array<{
      player_puuid: string;
      player_display_name: string;
      player_team: string;
      location: {
        x: number;
        y: number;
      };
      view_radians: number;
    }>;
    assistants: Array<{
      assistant_puuid: string;
      assistant_display_name: string;
      assistant_team: string;
    }>;
  }>;
};
