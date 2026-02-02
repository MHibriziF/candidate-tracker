export interface Statistics {
  totalCandidates: number;
  candidatesByStatus: Record<string, number>;
  candidatesByMonth: Record<string, number>;
}
