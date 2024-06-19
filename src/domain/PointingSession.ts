import { Entity } from './Entity';

export class PointingSession extends Entity {
  private _participants: Set<string>;
  private _votes: Map<string, number>;

  get participants() {
    return Array.from(this._participants.values());
  }

  constructor() {
    super();
    this._participants = new Set<string>();
    this._votes = new Map<string, number>();
  }

  join(participant: string) {
    this._participants.add(participant);
  }

  leave(participant: string) {
    this._participants.delete(participant);
  }

  vote(participant: string, points: number) {
    this._votes.set(participant, points);
  }

  clearVotes() {
    this._votes = new Map<string, number>();
  }
}
