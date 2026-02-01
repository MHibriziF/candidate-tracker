import { candidateService } from '../../services/candidate.service';
import { Errors } from '../../utils/error';
import type { CreateCandidateDto, CandidateStatus } from '../../types/candidate';
import { readBody, getQuery } from 'h3';

export default defineEventHandler(async (event) => {
  const method = event.method;

  if (method === 'POST') {
    const candidateData = await readBody<CreateCandidateDto>(event);

    try {
      const newCandidate = await candidateService.addCandidate(candidateData);
      return newCandidate;
    } catch (err: any) {
      throw err;
    }
  }

  if (method === 'GET') {
    const query = getQuery(event);
    const status = query.status as CandidateStatus | undefined;

    try {
      const candidates = await candidateService.getAllCandidates(status);
      return candidates;
    } catch (err: any) {
      throw Errors.db(err);
    }
  }

  throw Errors.methodsNotAllowed(`Method ${event.method} not allowed`);
});
