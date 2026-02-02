export interface Statistics {
  totalCandidates: number;
  totalByRange: number;
  candidatesByStatus: Record<string, number>;
  candidatesByMonth: Record<string, number>;
}
