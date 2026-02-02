import { query } from './db';
import { CandidateStatus } from '../types/candidate';

const debug = process.env.NODE_ENV !== 'production';

export async function initDb() {
  if (debug) {
    await query(`DROP TABLE IF EXISTS candidates`);
    console.warn('Dropped existing candidates table (debug mode)');
  }

  // Create table
  await query(`
    CREATE TABLE IF NOT EXISTS candidates (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      status TEXT NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `);

  console.info('Candidates table ready');

  // Seed dummy data if debug
  if (debug) {
    console.info('Seeding dummy candidates...');
    const dummyCandidates = [
      {
        name: 'Alice',
        email: 'alice@example.com',
        phone: '+621234567890',
        status: CandidateStatus.NEW,
      },
      {
        name: 'Bob',
        email: 'bob@example.com',
        phone: '+621234567891',
        status: CandidateStatus.CONTACTED,
      },
      {
        name: 'Charlie',
        email: 'charlie@example.com',
        phone: '+621234567892',
        status: CandidateStatus.INTERESTED,
      },
      {
        name: 'Diana',
        email: 'diana@example.com',
        phone: '+621234567893',
        status: CandidateStatus.REJECTED,
      },
      {
        name: 'Ethan',
        email: 'ethan@example.com',
        phone: '+621234567894',
        status: CandidateStatus.NEW,
      },
      {
        name: 'Fiona',
        email: 'fiona@example.com',
        phone: '+621234567895',
        status: CandidateStatus.CONTACTED,
      },
      {
        name: 'George',
        email: 'george@example.com',
        phone: '+621234567896',
        status: CandidateStatus.INTERESTED,
      },
      {
        name: 'Hannah',
        email: 'hannah@example.com',
        phone: '+621234567897',
        status: CandidateStatus.REJECTED,
      },
      {
        name: 'Isaac',
        email: 'isaac@example.com',
        phone: '+621234567898',
        status: CandidateStatus.NEW,
      },
      {
        name: 'Jacob',
        email: 'jacob@example.com',
        phone: '+621234567899',
        status: CandidateStatus.CONTACTED,
      },
      {
        name: 'Kevin',
        email: 'kevin@example.com',
        phone: '+621234567890',
        status: CandidateStatus.INTERESTED,
      },
      {
        name: 'Liam',
        email: 'liam@example.com',
        phone: '+621234567891',
        status: CandidateStatus.REJECTED,
      },
      {
        name: 'Mason',
        email: 'mason@example.com',
        phone: '+621234567892',
        status: CandidateStatus.NEW,
      },    
    ];

    for (const c of dummyCandidates) {
      await query(`INSERT INTO candidates (name, email, phone, status) VALUES ($1, $2, $3, $4)`, [
        c.name,
        c.email,
        c.phone,
        c.status,
      ]);
    }

    console.info('Dummy candidates seeded');
  }
}
