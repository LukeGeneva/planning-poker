import type { ServerWebSocket } from 'bun';
import { Room } from './Room';
import type { PointingSessionSocketData } from './PointingSessionSocketData';

export class RoomCollection {
  private _rooms: Map<string, Room>;

  constructor() {
    this._rooms = new Map();
  }

  add(room: Room) {
    this._rooms.set(room.id, room);
  }

  remove(roomId: string) {
    this._rooms.delete(roomId);
  }

  joinOrCreate(socket: ServerWebSocket<PointingSessionSocketData>) {
    let room = this._rooms.get(socket.data.pointingSessionId);
    if (!room) room = new Room(socket.data.pointingSessionId);
    room.join(socket);
  }

  leave(socket: ServerWebSocket<PointingSessionSocketData>) {
    const room = this._rooms.get(socket.data.pointingSessionId);
    if (!room) return;
    room.leave(socket);
  }
}
