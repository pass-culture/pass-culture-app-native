export enum CreditStatus {
  GONE = 'passé',
  ONGOING = 'cette année',
  COMING = 'à venir',
}

export enum NonEligible {
  UNDER_15 = 'under_15',
  OVER_18 = 'over_18',
}

export enum UserOnboardingRole {
  UNDERAGE = 'underage',
  EIGHTEEN = 'eighteen',
  NON_ELIGIBLE = 'non_eligible',
  UNKNOWN = 'unknown',
}

const eligibleAgesList = [15, 16, 17, 18] as const
type EligibleAgesList = typeof eligibleAgesList
export type EligibleAges = EligibleAgesList[number]
