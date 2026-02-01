import { candidateService } from "../../services/candidate.service";
import { Errors } from "../../utils/error";
import { CandidateStatus } from "../../types/candidate";
import { readBody } from "h3";

export default defineEventHandler(async (event) => {
  const method = event.method;
  const { id } = event.context.params as { id: string };

  try {
    if (method === "GET") {
      const candidate = await candidateService.getCandidateById(id);
      if (!candidate)
        throw Errors.notFound(`Candidate with id ${id} not found`);
      return candidate;
    }

    if (method === "PATCH") {
      const body = await readBody<{ status: CandidateStatus }>(event);
      if (!body?.status)
        throw Errors.badRequest("Status is required for update");
      if (
        !Object.values(CandidateStatus).includes(body.status as CandidateStatus)
      ) {
        throw Errors.badRequest(`Invalid status value: ${body.status}`);
      }
      const updated = await candidateService.updateCandidateStatus(
        id,
        body.status as CandidateStatus,
      );
      if (!updated) throw Errors.notFound(`Candidate with id ${id} not found`);
      return updated;
    }

    if (method === "DELETE") {
      const deleted = await candidateService.deleteCandidate(id);
      if (!deleted) throw Errors.notFound(`Candidate with id ${id} not found`);
      return deleted;
    }

    throw Errors.methodsNotAllowed(`Method ${method} not allowed`);
  } catch (err: any) {
    throw err;
  }
});
