import { CandidateStatus } from '~~/server/types/candidate';

const getStatusColor = (status: CandidateStatus) => {
  switch (status) {
    case CandidateStatus.NEW:
      return 'blue' as const;
    case CandidateStatus.CONTACTED:
      return 'purple' as const;
    case CandidateStatus.INTERESTED:
      return 'green' as const;
    case CandidateStatus.REJECTED:
      return 'red' as const;
    default:
      return 'gray' as const;
  }
};

export default getStatusColor;
