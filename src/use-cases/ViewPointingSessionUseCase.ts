import { type PointingSessionRepository } from '../domain/PointingSessionRepository';

export type ViewPointingSessionOutput = {
  id: string;
  participants: Array<{
    participant: string;
    vote: number | null;
  }>;
};

export class ViewPointingSessionUseCase {
  constructor(private pointingSessionRepository: PointingSessionRepository) {}

  async execute(pointingSessionId: string): Promise<ViewPointingSessionOutput> {
    const session =
      await this.pointingSessionRepository.findById(pointingSessionId);
    return { id: session.id, participants: session.votes };
  }
}
