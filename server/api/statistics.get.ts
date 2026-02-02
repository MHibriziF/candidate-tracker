import { candidateService } from '../services/candidate.service';
import { getQuery } from 'h3';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  const start = query.start as string;
  const end = query.end as string;

  return await candidateService.getStatistics(start, end);
});
