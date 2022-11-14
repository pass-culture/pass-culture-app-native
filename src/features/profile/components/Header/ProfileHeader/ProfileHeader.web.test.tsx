import mockdate from 'mockdate'
import React from 'react'

import { UserProfileResponse, YoungStatusType } from 'api/gen'
import { ProfileHeader } from 'features/profile/components/Header/ProfileHeader/ProfileHeader'
import { domains_credit_v1 } from 'features/profile/fixtures/domainsCredit'
import { render } from 'tests/utils/web'

const user: UserProfileResponse = {
  bookedOffers: {},
  email: 'email2@domain.ext',
  firstName: 'Jean',
  isBeneficiary: true,
  dateOfBirth: '2003-01-01',
  depositExpirationDate: '2023-02-09T11:17:14.786670',
  domainsCredit: domains_credit_v1,
  lastName: '93 HNMM 2',
  id: 1234,
  isEligibleForBeneficiaryUpgrade: false,
  needsToFillCulturalSurvey: true,
  roles: [],
  showEligibleCard: false,
  subscriptions: {
    marketingEmail: true,
    marketingPush: true,
  },
  status: { statusType: YoungStatusType.beneficiary },
}

jest.mock('features/profile/api')

const exBeneficiaryUser: UserProfileResponse = {
  ...user,
  depositExpirationDate: '2020-01-01T03:04:05',
}

jest.mock('features/auth/AuthContext', () => ({
  useAuthContext: jest.fn(() => ({ isLoggedIn: true })),
}))

describe('ProfileHeader', () => {
  beforeEach(() => {
    mockdate.set('2021-07-01T00:00:00Z')
  })

  it('should display the BeneficiaryHeader if user is beneficiary', () => {
    const { getByText } = render(<ProfileHeader user={user} />)
    expect(getByText('Profite de ton crédit jusqu’au')).toBeTruthy()
  })

  it('should display the ExBeneficiary Header if credit is expired', () => {
    const { getByText } = render(<ProfileHeader user={exBeneficiaryUser} />)
    expect(getByText('Ton crédit a expiré le')).toBeTruthy()
  })
})
