import type { PointingSessionRepository } from '../domain/PointingSessionRepository';

export type JoinPointingSessionInput = {
  pointingSessionId: string;
  participantName: string;
};

export class JoinPointingSessionUseCase {
  constructor(private pointingSessionRepository: PointingSessionRepository) {}

  async execute(input: JoinPointingSessionInput) {
    const session = await this.pointingSessionRepository.findById(
      input.pointingSessionId
    );
    session.join(input.participantName);
    await this.pointingSessionRepository.update(session);
  }
}
