import { candidateRepository, CandidateRepository } from '../data/candidate.repository';
import { Candidate, CandidateStatus, CreateCandidateDto } from '../types/candidate';
import { Errors } from '../utils/error';

export class CandidateService {
  private static _instance: CandidateService;

  public static get instance() {
    if (!this._instance) {
      this._instance = new CandidateService(candidateRepository);
    }
    return this._instance;
  }

  private constructor(private repo: CandidateRepository) {}

  async addCandidate(candidateData: CreateCandidateDto): Promise<Candidate> {
    // Validation & sanitization
    const { name, email, phone, status } = candidateData;
    if (!name || !email || !phone || !status) {
      throw Errors.badRequest('Missing required candidate fields');
    }
    if (!/\S+@\S+\.\S+/.test(email)) throw Errors.badRequest('Invalid email format');
    if (!/^\+?[0-9]{7,15}$/.test(phone)) throw Errors.badRequest('Invalid phone number format');
    if (!Object.values(CandidateStatus).includes(status))
      throw Errors.badRequest('Invalid candidate status');

    const sanitized: CreateCandidateDto = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      status,
    };

    return this.repo.create(sanitized);
  }

  async getAllCandidates(
    status?: CandidateStatus,
    page: number = 1,
    perPage: number = 10,
    search?: string
  ): Promise<{
    data: Candidate[];
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
  }> {
    return this.repo.getAll(status, page, perPage, search);
  }

  async getCandidateById(id: string): Promise<Candidate | null> {
    return this.repo.getById(id);
  }

  async updateCandidateStatus(id: string, status: CandidateStatus): Promise<Candidate | null> {
    return this.repo.updateStatus(id, status);
  }

  async deleteCandidate(id: string): Promise<Candidate | null> {
    return this.repo.delete(id);
  }
}

export const candidateService = CandidateService.instance;
