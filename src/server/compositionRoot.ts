import { MemoryPointingSessionRepository } from '../adapters/MemoryPointingSessionRepository';
import { CreatePointingSessionUseCase } from '../use-cases/CreatePointingSessionUseCase';
import { ViewPointingSessionUseCase } from '../use-cases/ViewPointingSessionUseCase';
import { JoinPointingSessionUseCase } from '../use-cases/JoinPointingSessionUseCase';
import { CastVoteUseCase } from '../use-cases/CastVoteUseCase';

export const pointingSessionRepository = new MemoryPointingSessionRepository();

export const createPointingSession = new CreatePointingSessionUseCase(
  pointingSessionRepository
);
export const viewPointingSession = new ViewPointingSessionUseCase(
  pointingSessionRepository
);
export const joinPointingSession = new JoinPointingSessionUseCase(
  pointingSessionRepository
);
export const castVote = new CastVoteUseCase(pointingSessionRepository);
