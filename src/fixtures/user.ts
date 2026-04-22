import { format } from 'date-fns'

import {
  ActivityIdEnum,
  CurrencyEnum,
  DepositType,
  EligibilityType,
  QFBonificationStatus,
  UserProfileResponse,
  UserRole,
  YoungStatusType,
} from 'api/gen'
import {
  EIGHTEEN_AGE_DATE,
  FOURTEEN_AGE_DATE,
  SIXTEEN_AGE_DATE,
} from 'features/auth/fixtures/fixtures'
import { UserCreditType } from 'features/auth/helpers/getCreditType'
import { UserEligibilityType } from 'features/auth/helpers/getEligibilityType'
import { UserStatusType } from 'features/auth/helpers/getStatusType'
import { UserProfile } from 'features/share/types'

export const nonBeneficiaryUser: UserProfile = {
  qfBonificationStatus: QFBonificationStatus.not_eligible,
  bookedOffers: {},
  domainsCredit: {
    all: { initial: 0, remaining: 0 },
    physical: { initial: 0, remaining: 0 },
    digital: { initial: 0, remaining: 0 },
  },
  birthDate: format(EIGHTEEN_AGE_DATE, 'yyyy-MM-dd'),
  email: 'email@domain.ext',
  hasPassword: true,
  requiresIdCheck: false,
  roles: [],
  showEligibleCard: false,
  isEligibleForBeneficiaryUpgrade: false,
  id: 1234,
  subscriptions: {
    marketingEmail: true,
    marketingPush: true,
  },
  currency: CurrencyEnum.EUR,
  achievements: [],
  hasProfileExpired: false,
  statusType: UserStatusType.GENERAL_PUBLIC,
  creditType: UserCreditType.CREDIT_EMPTY,
  eligibilityType: UserEligibilityType.NOT_ELIGIBLE,
}

export const beneficiaryUser: UserProfile = {
  ...nonBeneficiaryUser,
  domainsCredit: {
    all: { initial: 300_00, remaining: 250_00 },
    physical: { initial: 300_00, remaining: 100_00 },
    digital: { initial: 300_00, remaining: 200_00 },
  },
  roles: [UserRole.BENEFICIARY],
  isEligibleForBeneficiaryUpgrade: false,
  depositActivationDate: '2021-11-19T11:00:00Z',
  eligibilityEndDatetime: '2023-11-19T11:00:00Z',
  depositExpirationDate: '2050-11-19T11:00:00Z',
  birthDate: format(EIGHTEEN_AGE_DATE, 'yyyy-MM-dd'),
  firstName: 'Jean',
  lastName: 'Dupond',
  city: 'Paris',
  postalCode: '75001',
  street: '10 rue du Bonheur',
  activityId: ActivityIdEnum.STUDENT,
  statusType: UserStatusType.BENEFICIARY,
  creditType: UserCreditType.CREDIT_V3_18,
  eligibilityType: UserEligibilityType.ELIGIBLE_CREDIT_V3_18,
}

export const underageBeneficiaryUser: UserProfile = {
  ...beneficiaryUser,
  roles: [UserRole.UNDERAGE_BENEFICIARY],
  isEligibleForBeneficiaryUpgrade: false,
  statusType: UserStatusType.GENERAL_PUBLIC,
  creditType: UserCreditType.CREDIT_EMPTY,
  eligibilityType: UserEligibilityType.NOT_ELIGIBLE,
}

export const exBeneficiaryUser: UserProfile = {
  ...beneficiaryUser,
  depositExpirationDate: '2020-01-01T03:04:05',
  statusType: UserStatusType.EX_BENEFICIARY,
  creditType: UserCreditType.CREDIT_EMPTY,
  eligibilityType: UserEligibilityType.NOT_ELIGIBLE,
}

const baseNonBeneficiaryUser = {
  achievements: [],
  activityId: ActivityIdEnum.HIGH_SCHOOL_STUDENT,
  birthDate: format(FOURTEEN_AGE_DATE, 'yyyy-MM-dd'),
  bookedOffers: {},
  city: 'Paris',
  currency: CurrencyEnum.EUR,
  depositActivationDate: '2021-11-19T11:00:00Z',
  depositExpirationDate: '2050-11-19T11:00:00Z',
  domainsCredit: {
    all: { initial: 0, remaining: 0 },
    physical: { initial: 0, remaining: 0 },
    digital: { initial: 0, remaining: 0 },
  },
  eligibility: EligibilityType.underage,
  eligibilityEndDatetime: null,
  eligibilityStartDatetime: null,
  email: 'email@domain.ext',
  firstDepositActivationDate: null,
  firstName: 'Jeanne',
  hasPassword: true,
  hasProfileExpired: false,
  id: 1234,
  isBeneficiary: false,
  isEligibleForBeneficiaryUpgrade: false,
  lastName: 'Dupond',
  phoneNumber: '+33639980123',
  postalCode: '75001',
  qfBonificationStatus: QFBonificationStatus.not_eligible,
  recreditAmountToShow: null,
  recreditTypeToShow: null,
  remainingBonusAttempts: null,
  requiresIdCheck: false,
  roles: [],
  showEligibleCard: false,
  status: { statusType: YoungStatusType.eligible },
  street: '10 rue du Bonheur',
  subscriptionMessage: null,
  subscriptions: {
    marketingEmail: true,
    marketingPush: true,
  },
}
export const nonBeneficiaryUserFromAPI: UserProfileResponse = {
  ...baseNonBeneficiaryUser,
  depositType: undefined,
  needsToFillCulturalSurvey: false,
}

export const nonBeneficiaryUserV2: UserProfile = {
  ...baseNonBeneficiaryUser,
  statusType: UserStatusType.GENERAL_PUBLIC,
  creditType: UserCreditType.CREDIT_EMPTY,
  eligibilityType: UserEligibilityType.NOT_ELIGIBLE,
}

export const baseBeneficiaryUser = {
  ...baseNonBeneficiaryUser,
  activityId: ActivityIdEnum.STUDENT,
  birthDate: format(EIGHTEEN_AGE_DATE, 'yyyy-MM-dd'),
  depositActivationDate: '2021-11-19T11:00:00Z',
  depositExpirationDate: '2050-11-19T11:00:00Z',
  domainsCredit: {
    all: { initial: 300_00, remaining: 250_00 },
    physical: { initial: 300_00, remaining: 100_00 },
    digital: { initial: 300_00, remaining: 200_00 },
  },
  eligibility: EligibilityType['age-17-18'],
  eligibilityEndDatetime: '2023-11-19T11:00:00Z',
  firstName: 'Jean',
  isBeneficiary: true,
  roles: [UserRole.BENEFICIARY],
  status: { statusType: YoungStatusType.beneficiary },
}
export const beneficiaryUserFromAPI: UserProfileResponse = {
  ...baseBeneficiaryUser,
  depositType: DepositType.GRANT_17_18,
  needsToFillCulturalSurvey: false,
}

export const beneficiaryUserV2: UserProfile = {
  ...baseBeneficiaryUser,
  statusType: UserStatusType.BENEFICIARY,
  creditType: UserCreditType.CREDIT_V3_18,
  eligibilityType: UserEligibilityType.ELIGIBLE_CREDIT_V3_18,
}

export const baseEligibleUser = {
  ...baseNonBeneficiaryUser,
  activityId: ActivityIdEnum.HIGH_SCHOOL_STUDENT,
  birthDate: format(SIXTEEN_AGE_DATE, 'yyyy-MM-dd'),
  eligibility: EligibilityType.free,
  roles: [UserRole.FREE_BENEFICIARY],
  showEligibleCard: false,
  status: { statusType: YoungStatusType.eligible },
}

export const eligibleUserFromAPI: UserProfileResponse = {
  ...baseEligibleUser,
  depositType: DepositType.GRANT_FREE,
  needsToFillCulturalSurvey: false,
}

export const eligibleUserV2: UserProfile = {
  ...baseEligibleUser,
  statusType: UserStatusType.ELIGIBLE,
  creditType: UserCreditType.CREDIT_V3_16,
  eligibilityType: UserEligibilityType.ELIGIBLE_CREDIT_V3_16,
}

export const exBeneficiaryUserFromAPI: UserProfileResponse = {
  ...baseEligibleUser,
  depositType: DepositType.GRANT_18,
  needsToFillCulturalSurvey: false,
}

export const exBeneficiaryUserV2: UserProfile = {
  ...baseEligibleUser,
  depositExpirationDate: '2020-01-01T03:04:05',
  statusType: UserStatusType.EX_BENEFICIARY,
  creditType: UserCreditType.CREDIT_EXPIRED,
  eligibilityType: UserEligibilityType.NOT_ELIGIBLE,
}
