import { UserProfileResponse, UserRole, YoungStatusType } from 'api/gen'

export const nonBeneficiaryUser: UserProfileResponse = {
  bookedOffers: {},
  domainsCredit: {
    all: { initial: 0, remaining: 0 },
    physical: { initial: 0, remaining: 0 },
    digital: { initial: 0, remaining: 0 },
  },
  email: 'email@domain.ext',
  firstName: 'Jean',
  isBeneficiary: false,
  needsToFillCulturalSurvey: true,
  roles: [],
  showEligibleCard: false,
  isEligibleForBeneficiaryUpgrade: false,
  id: 1234,
  subscriptions: {
    marketingEmail: true,
    marketingPush: true,
  },
  status: { statusType: YoungStatusType.non_eligible },
}

export const beneficiaryUser: UserProfileResponse = {
  ...nonBeneficiaryUser,
  domainsCredit: {
    all: { initial: 30000, remaining: 25000 },
    physical: { initial: 30000, remaining: 10000 },
    digital: { initial: 30000, remaining: 20000 },
  },
  isBeneficiary: true,
  roles: [UserRole.BENEFICIARY],
  isEligibleForBeneficiaryUpgrade: false,
}

export const underageBeneficiaryUser: UserProfileResponse = {
  ...beneficiaryUser,
  isBeneficiary: false,
  roles: [UserRole.UNDERAGE_BENEFICIARY],
  isEligibleForBeneficiaryUpgrade: false,
}
