export enum CandidateStatus {
  NEW = 'New',
  CONTACTED = 'Contacted',
  INTERESTED = 'Interested',
  REJECTED = 'Rejected',
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: CandidateStatus;
  createdAt: string;
}

export type CreateCandidateDto = Omit<Candidate, 'id' | 'createdAt'>;
