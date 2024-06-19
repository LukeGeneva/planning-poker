import type { PointingSession } from './PointingSession';

export interface PointingSessionRepository {
  create: (session: PointingSession) => Promise<void>;
  update: (session: PointingSession) => Promise<void>;
  delete: (sessionId: string) => Promise<void>;
  findById: (id: string) => Promise<PointingSession>;
}
