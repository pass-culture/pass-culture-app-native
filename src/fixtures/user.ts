import { UserProfileResponse, UserRole } from 'api/gen'

export const nonBeneficaryUser: UserProfileResponse = {
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
  id: 1234,
  subscriptions: {
    marketingEmail: true,
    marketingPush: true,
  },
}

export const beneficiaryUser: UserProfileResponse = {
  ...nonBeneficaryUser,
  domainsCredit: {
    all: { initial: 50000, remaining: 40000 },
    physical: { initial: 30000, remaining: 10000 },
    digital: { initial: 30000, remaining: 20000 },
  },
  isBeneficiary: true,
  roles: [UserRole.BENEFICIARY],
}

export const underageBeneficiaryUser: UserProfileResponse = {
  ...beneficiaryUser,
  isBeneficiary: false,
  roles: [UserRole.UNDERAGEBENEFICIARY],
}
