import mockdate from 'mockdate'
import React from 'react'

import { UserProfileResponse, YoungStatusType } from 'api/gen'
import { ProfileHeader } from 'features/profile/components/Header/ProfileHeader/ProfileHeader'
import { domains_credit_v1 } from 'features/profile/fixtures/domainsCredit'
import { render, screen } from 'tests/utils/web'

jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

const user: UserProfileResponse = {
  bookedOffers: {},
  email: 'email2@domain.ext',
  hasPassword: true,
  firstName: 'Jean',
  isBeneficiary: true,
  birthDate: '2003-01-01',
  depositExpirationDate: '2023-02-09T11:17:14.786670',
  domainsCredit: domains_credit_v1,
  lastName: '93 HNMM 2',
  id: 1234,
  isEligibleForBeneficiaryUpgrade: false,
  needsToFillCulturalSurvey: true,
  requiresIdCheck: false,
  roles: [],
  showEligibleCard: false,
  subscriptions: {
    marketingEmail: true,
    marketingPush: true,
  },
  status: { statusType: YoungStatusType.beneficiary },
}

jest.mock('features/profile/api/useUpdateProfileMutation')

const exBeneficiaryUser: UserProfileResponse = {
  ...user,
  depositExpirationDate: '2020-01-01T03:04:05',
}

jest.mock('features/auth/context/AuthContext', () => ({
  useAuthContext: jest.fn(() => ({ isLoggedIn: true })),
}))

jest.mock('libs/firebase/analytics/analytics')

describe('ProfileHeader', () => {
  beforeEach(() => {
    mockdate.set('2021-07-01T00:00:00Z')
  })

  it('should display the BeneficiaryHeader if user is beneficiary', () => {
    render(<ProfileHeader user={user} />)

    expect(screen.getByText('Profite de ton crédit jusqu’au')).toBeInTheDocument()
  })

  it('should display the ExBeneficiary Header if credit is expired', () => {
    render(<ProfileHeader user={exBeneficiaryUser} />)

    expect(screen.getByText('Ton crédit a expiré le')).toBeInTheDocument()
  })
})
