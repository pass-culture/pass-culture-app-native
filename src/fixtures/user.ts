import { format } from 'date-fns'

import {
  ActivityIdEnum,
  CurrencyEnum,
  DepositType,
  EligibilityType,
  UserRole,
  YoungStatusType,
} from 'api/gen'
import { EIGHTEEN_AGE_DATE } from 'features/auth/fixtures/fixtures'
import { domains_credit_v3 } from 'features/profile/fixtures/domainsCredit'
import { UserProfileResponseWithoutSurvey } from 'features/share/types'

export const nonBeneficiaryUser: UserProfileResponseWithoutSurvey = {
  bookedOffers: {},
  domainsCredit: {
    all: { initial: 0, remaining: 0 },
    physical: { initial: 0, remaining: 0 },
    digital: { initial: 0, remaining: 0 },
  },
  birthDate: format(EIGHTEEN_AGE_DATE, 'yyyy-MM-dd'),
  email: 'email@domain.ext',
  hasPassword: true,
  isBeneficiary: false,
  requiresIdCheck: false,
  roles: [],
  showEligibleCard: false,
  isEligibleForBeneficiaryUpgrade: false,
  id: 1234,
  subscriptions: {
    marketingEmail: true,
    marketingPush: true,
  },
  status: { statusType: YoungStatusType.non_eligible },
  currency: CurrencyEnum.EUR,
  achievements: [],
  hasProfileExpired: false,
}

export const beneficiaryUser: UserProfileResponseWithoutSurvey = {
  ...nonBeneficiaryUser,
  domainsCredit: {
    all: { initial: 300_00, remaining: 250_00 },
    physical: { initial: 300_00, remaining: 100_00 },
    digital: { initial: 300_00, remaining: 200_00 },
  },
  isBeneficiary: true,
  roles: [UserRole.BENEFICIARY],
  isEligibleForBeneficiaryUpgrade: false,
  status: { statusType: YoungStatusType.beneficiary },
  depositType: DepositType.GRANT_18,
  eligibility: EligibilityType['age-18'],
  depositActivationDate: '2021-11-19T11:00:00Z',
  eligibilityEndDatetime: '2023-11-19T11:00:00Z',
  birthDate: format(EIGHTEEN_AGE_DATE, 'yyyy-MM-dd'),
  firstName: 'Jean',
  lastName: 'Dupond',
  city: 'Paris',
  postalCode: '75001',
  street: '10 rue du Bonheur',
  activityId: ActivityIdEnum.STUDENT,
}

export const underageBeneficiaryUser: UserProfileResponseWithoutSurvey = {
  ...beneficiaryUser,
  isBeneficiary: false,
  roles: [UserRole.UNDERAGE_BENEFICIARY],
  isEligibleForBeneficiaryUpgrade: false,
  status: { statusType: YoungStatusType.eligible },
}

export const profileHeaderUser: UserProfileResponseWithoutSurvey = {
  bookedOffers: {},
  email: 'email2@domain.ext',
  hasPassword: true,
  firstName: 'Jean',
  isBeneficiary: true,
  birthDate: '2003-01-01',
  depositExpirationDate: '2023-02-09T11:17:14.786670',
  domainsCredit: domains_credit_v3,
  lastName: '93 HNMM 2',
  id: 1234,
  isEligibleForBeneficiaryUpgrade: false,
  requiresIdCheck: false,
  roles: [],
  showEligibleCard: false,
  subscriptions: {
    marketingEmail: true,
    marketingPush: true,
  },
  status: { statusType: YoungStatusType.beneficiary },
  currency: CurrencyEnum.EUR,
  achievements: [],
  street: '10 rue du Bohneur',
  hasProfileExpired: false,
}

export const profileHeaderUserExBeneficiaryUser: UserProfileResponseWithoutSurvey = {
  ...profileHeaderUser,
  depositExpirationDate: '2020-01-01T03:04:05',
}

export const profileHeaderUserNotBeneficiaryUser = {
  ...profileHeaderUser,
  isBeneficiary: false,
}
