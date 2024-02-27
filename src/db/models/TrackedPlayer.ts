import {ObjectId} from 'mongodb';

export default interface TrackedPlayer {
  name: string;
  tag: string;
  lastNotifiedMatchId: string;
  playerId: string;
  channelIds: Array<string>;
  id?: ObjectId;
  updatedAt: Date;
  sessionRR: number;
}
