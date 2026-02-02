import { query } from '../data/db';
import { CandidateStatus } from '../types/candidate';
import type { Candidate, CreateCandidateDto } from '../types/candidate';
import { toCamelCase } from '../utils/case';

export class CandidateRepository {
  // Singleton instance
  private static _instance: CandidateRepository;

  public static get instance() {
    if (!this._instance) {
      this._instance = new CandidateRepository();
    }
    return this._instance;
  }

  private constructor() {}

  async getAll(
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
    // Build WHERE clause for count query
    const conditions: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (status) {
      conditions.push(`status = $${paramIndex}`);
      params.push(status);
      paramIndex++;
    }

    if (search && search.trim()) {
      const searchTerm = `%${search.trim().toLowerCase()}%`;
      conditions.push(`(
        LOWER(name) LIKE $${paramIndex} OR 
        LOWER(email) LIKE $${paramIndex} OR 
        LOWER(phone) LIKE $${paramIndex}
      )`);
      params.push(searchTerm);
      paramIndex++;
    }

    const whereClause = conditions.length > 0 ? ` WHERE ${conditions.join(' AND ')}` : '';

    // Get total count
    const countSql = `SELECT COUNT(*) as total FROM candidates${whereClause}`;
    const countRes = await query(countSql, params);
    const total = parseInt(countRes.rows[0].total, 10);

    // Calculate pagination
    const totalPages = Math.ceil(total / perPage);
    const validPage = Math.max(1, Math.min(page, totalPages || 1));
    const offset = (validPage - 1) * perPage;

    // Build data query
    let sql = 'SELECT * FROM candidates';
    sql += whereClause;
    sql += ' ORDER BY created_at DESC';
    sql += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(perPage, offset);

    const res = await query(sql, params);

    // Transform snake_case to camelCase to match TypeScript type
    const data = toCamelCase(res.rows);

    return {
      data,
      total,
      page: validPage,
      perPage,
      totalPages,
    };
  }

  async getById(id: string): Promise<Candidate | null> {
    const res = await query('SELECT * FROM candidates WHERE id = $1', [id]);
    if (!res.rows[0]) return null;
    return {
      ...toCamelCase(res.rows[0]),
    };
  }

  async create(candidate: CreateCandidateDto): Promise<Candidate> {
    const sql = `
      INSERT INTO candidates (name, email, phone, status, created_at)
      VALUES ($1, $2, $3, $4, NOW())
      RETURNING *
    `;
    const params = [candidate.name, candidate.email, candidate.phone, candidate.status];
    const res = await query(sql, params);
    return {
      ...res.rows[0],
      createdAt: res.rows[0].created_at,
    };
  }

  async updateStatus(id: string, status: CandidateStatus) {
    const res = await query('UPDATE candidates SET status = $1 WHERE id = $2 RETURNING *', [
      status,
      id,
    ]);
    if (!res.rows[0]) return null;
    return {
      ...res.rows[0],
      createdAt: res.rows[0].created_at,
    };
  }

  async delete(id: string) {
    const res = await query('DELETE FROM candidates WHERE id = $1 RETURNING *', [id]);
    if (!res.rows[0]) return null;
    return {
      ...res.rows[0],
      createdAt: res.rows[0].created_at,
    };
  }

  async countByStatusRange(start: string, end: string): Promise<Record<string, number>> {
    const sql = `
      SELECT status, COUNT(*) AS count
      FROM candidates
      WHERE created_at >= $1
        AND created_at < $2::timestamp + INTERVAL '1 day'
      GROUP BY status
    `;

    const res = await query(sql, [start, end]);

    const result: Record<string, number> = {};

    res.rows.forEach((row: { status: string; count: string }) => {
      result[row.status] = Number(row.count);
    });

    return result;
  }

  async countByMonthRange(start: string, end: string) {
    const sql = `
      WITH month_series AS (
        SELECT TO_CHAR(month, 'YYYY-MM') AS month
        FROM generate_series(
          DATE_TRUNC('month', $1::timestamp),
          DATE_TRUNC('month', $2::timestamp),
          '1 month'::interval
        ) AS month
      )
      SELECT
        ms.month,
        COUNT(c.id) AS count
      FROM month_series ms
      LEFT JOIN candidates c
        ON TO_CHAR(c.created_at, 'YYYY-MM') = ms.month
        AND c.created_at >= DATE_TRUNC('month', $1::timestamp)
        AND c.created_at < DATE_TRUNC('month', $2::timestamp) + INTERVAL '1 month'
      GROUP BY ms.month
      ORDER BY ms.month
    `;

    const res = await query(sql, [start, end]);

    const result: Record<string, number> = {};

    for (const row of res.rows as { month: string; count: string }[]) {
      result[row.month] = Number(row.count);
    }

    return result;
  }
}

export const candidateRepository = CandidateRepository.instance;
