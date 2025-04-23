export enum CreditStatus {
  GONE = 'passé',
  ONGOING = 'cette année',
  COMING = 'à venir',
}

export enum NonEligible {
  UNDER_15 = 'under_15',
  UNDER_17 = 'under_17', // For credit V3
  OVER_18 = 'over_18',
  OTHER = 'other',
}

export enum UserOnboardingRole {
  UNDERAGE = 'underage',
  EIGHTEEN = 'eighteen',
  NON_ELIGIBLE = 'non_eligible',
  UNKNOWN = 'unknown',
}
