import type { PointingSessionRepository } from '../domain/PointingSessionRepository';

export type CastVoteInput = {
  pointingSessionId: string;
  participant: string;
  points: number;
};

export class CastVoteUseCase {
  constructor(private pointingSessionRepository: PointingSessionRepository) {}

  async execute(input: CastVoteInput) {
    const session = await this.pointingSessionRepository.findById(
      input.pointingSessionId
    );
    session.vote(input.participant, input.points);
    await this.pointingSessionRepository.update(session);
  }
}
