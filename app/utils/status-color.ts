import { CandidateStatus } from '~~/server/types/candidate';

const getStatusColor = (status: CandidateStatus) => {
  switch (status) {
    case CandidateStatus.NEW:
      return 'secondary' as const;
    case CandidateStatus.CONTACTED:
      return 'warning' as const;
    case CandidateStatus.INTERESTED:
      return 'primary' as const;
    case CandidateStatus.REJECTED:
      return 'error' as const;
    default:
      return 'gray' as const;
  }
};

export default getStatusColor;
