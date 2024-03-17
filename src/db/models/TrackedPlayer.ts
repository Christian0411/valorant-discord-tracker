import {ObjectId} from 'mongodb';
import { Stat } from './Stat';

export default interface TrackedPlayer {
  name: string;
  tag: string;
  lastNotifiedMatchId: string;
  playerId: string;
  channelIds: Array<string>;
  id?: ObjectId;
  updatedAt: Date;
  sessionRR: number;
  stats: {
    kd: Stat;
    hs: Stat;
  };
}
