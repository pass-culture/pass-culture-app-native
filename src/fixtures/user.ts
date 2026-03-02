import { format } from 'date-fns'

import {
  ActivityIdEnum,
  CurrencyEnum,
  DepositType,
  EligibilityType,
  QFBonificationStatus,
  UserRole,
  YoungStatusType,
} from 'api/gen'
import { EIGHTEEN_AGE_DATE } from 'features/auth/fixtures/fixtures'
import { UserCreditType } from 'features/auth/helpers/getCreditType'
import { UserEligibilityType } from 'features/auth/helpers/getEligibilityType'
import { UserStatusType } from 'features/auth/helpers/getStatusType'
import { UserProfileResponseWithoutSurvey } from 'features/share/types'

export const nonBeneficiaryUser: UserProfileResponseWithoutSurvey = {
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
  statusType: UserStatusType.GENERAL_PUBLIC,
  creditType: UserCreditType.NO_CREDIT,
  eligibilityType: UserEligibilityType.NOT_ELIGIBLE,
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
  depositType: DepositType.GRANT_17_18,
  eligibility: EligibilityType['age-17-18'],
  depositActivationDate: '2021-11-19T11:00:00Z',
  eligibilityEndDatetime: '2023-11-19T11:00:00Z',
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

export const underageBeneficiaryUser: UserProfileResponseWithoutSurvey = {
  ...beneficiaryUser,
  isBeneficiary: false,
  roles: [UserRole.UNDERAGE_BENEFICIARY],
  isEligibleForBeneficiaryUpgrade: false,
  status: { statusType: YoungStatusType.eligible },
  statusType: UserStatusType.GENERAL_PUBLIC,
  creditType: UserCreditType.NO_CREDIT,
  eligibilityType: UserEligibilityType.NOT_ELIGIBLE,
}

export const exBeneficiaryUser: UserProfileResponseWithoutSurvey = {
  ...beneficiaryUser,
  depositExpirationDate: '2020-01-01T03:04:05',
  statusType: UserStatusType.EX_BENEFICIARY,
  creditType: UserCreditType.NO_CREDIT,
  eligibilityType: UserEligibilityType.NOT_ELIGIBLE,
}
