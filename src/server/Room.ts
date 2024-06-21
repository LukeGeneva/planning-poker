import type { ServerWebSocket } from 'bun';
import type { PointingSessionSocketData } from './PointingSessionSocketData';

export class Room {
  private _id: string;
  private _sockets: Set<ServerWebSocket<PointingSessionSocketData>>;

  get id() {
    return this._id;
  }

  constructor(id: string) {
    this._id = id;
    this._sockets = new Set();
  }

  join(socket: ServerWebSocket<PointingSessionSocketData>) {
    this._sockets.add(socket);
  }

  leave(socket: ServerWebSocket<PointingSessionSocketData>) {
    this._sockets.delete(socket);
  }
}
