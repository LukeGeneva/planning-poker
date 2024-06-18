import type { PointingSession } from './PointingSession';

export interface PointingSessionRepository {
  create: (session: PointingSession) => Promise<void>;
  update: (session: PointingSession) => Promise<void>;
  delete: (session: PointingSession) => Promise<void>;
  findById: (id: string) => Promise<PointingSession>;
}
