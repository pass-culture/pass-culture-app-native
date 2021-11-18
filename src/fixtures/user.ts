import { BeneficiaryValidationStep, UserProfileResponse, UserRole } from 'api/gen'

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
  nextBeneficiaryValidationStep: BeneficiaryValidationStep.PhoneValidation,
}

export const beneficiaryUser: UserProfileResponse = {
  ...nonBeneficaryUser,
  domainsCredit: {
    all: { initial: 30000, remaining: 25000 },
    physical: { initial: 30000, remaining: 10000 },
    digital: { initial: 30000, remaining: 20000 },
  },
  isBeneficiary: true,
  roles: [UserRole.BENEFICIARY],
  nextBeneficiaryValidationStep: undefined,
}

export const underageBeneficiaryUser: UserProfileResponse = {
  ...beneficiaryUser,
  isBeneficiary: false,
  roles: [UserRole.UNDERAGEBENEFICIARY],
}
