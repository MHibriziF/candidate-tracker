import { candidateService } from '../../services/candidate.service';
import { Errors } from '../../utils/error';
import type { CreateCandidateDto, CandidateStatus } from '../../types/candidate';
import { readBody, getQuery } from 'h3';

export default defineEventHandler(async (event) => {
  const method = event.method;

  if (method === 'POST') {
    const candidateData = await readBody<CreateCandidateDto>(event);
    const newCandidate = await candidateService.addCandidate(candidateData);
    return newCandidate;
  }

  if (method === 'GET') {
    const query = getQuery(event);
    const status = query.status as CandidateStatus | undefined;
    const page = query.page ? parseInt(query.page as string, 10) : 1;
    const perPage = query.perPage ? parseInt(query.perPage as string, 10) : 10;
    const search = query.search as string | undefined;

    try {
      const result = await candidateService.getAllCandidates(status, page, perPage, search);
      return result;
    } catch (err: any) {
      throw Errors.db(err);
    }
  }

  throw Errors.methodsNotAllowed(`Method ${event.method} not allowed`);
});
