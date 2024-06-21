import { type PointingSessionRepository } from '../domain/PointingSessionRepository';

export type ViewPointingSessionInput = {
  pointingSessionId: string;
};

export type ViewPointingSessionOutput = {
  id: string;
  participants: Array<{
    participant: string;
    vote: number | null;
    hasVoted: boolean;
  }>;
};

export class ViewPointingSessionUseCase {
  constructor(private pointingSessionRepository: PointingSessionRepository) {}

  async execute(
    input: ViewPointingSessionInput
  ): Promise<ViewPointingSessionOutput> {
    const session = await this.pointingSessionRepository.findById(
      input.pointingSessionId
    );
    return {
      id: session.id,
      participants: session.votes.map((v) => ({
        ...v,
        hasVoted: v.vote !== null,
      })),
    };
  }
}
