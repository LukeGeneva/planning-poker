import type { PointingSession } from '../domain/PointingSession';
import type { PointingSessionRepository } from '../domain/PointingSessionRepository';

export class MemoryPointingSessionRepository
  implements PointingSessionRepository
{
  private _sessions: Map<string, PointingSession>;

  constructor() {
    this._sessions = new Map();
  }

  async create(session: PointingSession) {
    this._sessions.set(session.id, session);
  }

  async update(session: PointingSession) {
    this._sessions.set(session.id, session);
  }

  async findById(id: string) {
    const session = this._sessions.get(id);
    if (!session) throw new Error('Session not found.');
    return session;
  }

  async delete(id: string) {
    this._sessions.delete(id);
  }
}
