import {
  PointingSession,
  type PointingSessionRepository,
} from 'planning-poker/domain';

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
