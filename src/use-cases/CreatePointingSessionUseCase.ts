import { PointingSession } from '../domain/PointingSession';
import { type PointingSessionRepository } from '../domain/PointingSessionRepository';

export type CreatePointingSessionOutput = {
  pointingSessionId: string;
};

export class CreatePointingSessionUseCase {
  constructor(private pointingSessionRepository: PointingSessionRepository) {}

  async execute(): Promise<CreatePointingSessionOutput> {
    const session = new PointingSession();
    await this.pointingSessionRepository.create(session);
    return { pointingSessionId: session.id };
  }
}
