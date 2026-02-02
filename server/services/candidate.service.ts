import { candidateRepository, CandidateRepository } from '../data/candidate.repository';
import { Candidate, CandidateStatus, CreateCandidateDto } from '../types/candidate';
import { Statistics } from '../types/statistics';
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

  async getStatistics(start?: string, end?: string): Promise<Statistics> {
    const today = new Date();

    const defaultEnd = today.toISOString().slice(0, 10);

    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const defaultStart = threeMonthsAgo.toISOString().slice(0, 10);

    const safeStart = start || defaultStart;
    const safeEnd = end || defaultEnd;

    if (new Date(safeStart) > new Date(safeEnd)) {
      throw Errors.badRequest('Start date cannot be after end date');
    }

    const totalCandidates = (await this.repo.getAll()).total;
    const candidatesByStatus = await this.repo.countByStatusRange(safeStart, safeEnd);
    const candidatesByMonth = await this.repo.countByMonthRange(safeStart, safeEnd);

    const totalByRange = Object.values(candidatesByMonth).reduce(
      (sum, val) => sum + Number(val),
      0
    );

    return {
      totalCandidates,
      totalByRange,
      candidatesByStatus,
      candidatesByMonth,
    };
  }
}

export const candidateService = CandidateService.instance;
