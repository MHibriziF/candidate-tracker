import { query } from "../data/db";
import { CandidateStatus } from "../types/candidate";
import type { Candidate, CreateCandidateDto } from "../types/candidate";

export class CandidateRepository {
  // Singleton instance
  private static _instance: CandidateRepository;

  public static get instance() {
    if (!this._instance) {
      this._instance = new CandidateRepository();
    }
    return this._instance;
  }

  private constructor() {} // private to prevent `new`

  async getAll(status?: CandidateStatus): Promise<Candidate[]> {
    let sql = "SELECT * FROM candidates";
    const params: any[] = [];

    if (status) {
      sql += " WHERE status = $1";
      params.push(status);
    }

    const res = await query(sql, params);
    return res.rows;
  }

  async getById(id: string): Promise<Candidate | null> {
    const res = await query("SELECT * FROM candidates WHERE id = $1", [id]);
    return res.rows[0] || null;
  }

  async create(candidate: CreateCandidateDto): Promise<Candidate> {
    const sql = `
      INSERT INTO candidates (name, email, phone, status, created_at)
      VALUES ($1, $2, $3, $4, NOW())
      RETURNING *
    `;
    const params = [
      candidate.name,
      candidate.email,
      candidate.phone,
      candidate.status,
    ];
    const res = await query(sql, params);
    return res.rows[0];
  }

  async updateStatus(id: string, status: CandidateStatus) {
    const res = await query(
      "UPDATE candidates SET status = $1 WHERE id = $2 RETURNING *",
      [status, id],
    );
    return res.rows[0] || null;
  }

  async delete(id: string) {
    const res = await query(
      "DELETE FROM candidates WHERE id = $1 RETURNING *",
      [id],
    );
    return res.rows[0] || null;
  }
}

export const candidateRepository = CandidateRepository.instance;
