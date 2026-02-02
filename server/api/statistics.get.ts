import { candidateService } from '../services/candidate.service';
import { getQuery } from 'h3';

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const start = query.start as string;
    const end = query.end as string;
    const stats = await candidateService.getStatistics(start, end);
    return stats;
  } catch (err: any) {
    throw err;
  }
});
