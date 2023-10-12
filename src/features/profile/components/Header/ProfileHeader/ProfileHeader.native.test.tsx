import mockdate from 'mockdate'
import React from 'react'

import { UserProfileResponse, YoungStatusType } from 'api/gen'
import { ProfileHeader } from 'features/profile/components/Header/ProfileHeader/ProfileHeader'
import { domains_credit_v1 } from 'features/profile/fixtures/domainsCredit'
import { isUserUnderageBeneficiary } from 'features/profile/helpers/isUserUnderageBeneficiary'
import { render, screen } from 'tests/utils'

jest.mock('react-query')

const user: UserProfileResponse = {
  bookedOffers: {},
  email: 'email2@domain.ext',
  firstName: 'Jean',
  isBeneficiary: true,
  birthDate: '2003-01-01',
  depositExpirationDate: '2023-02-09T11:17:14.786670',
  domainsCredit: domains_credit_v1,
  lastName: '93 HNMM 2',
  id: 1234,
  needsToFillCulturalSurvey: true,
  isEligibleForBeneficiaryUpgrade: false,
  requiresIdCheck: false,
  roles: [],
  showEligibleCard: false,
  subscriptions: {
    marketingEmail: true,
    marketingPush: true,
  },
  status: { statusType: YoungStatusType.beneficiary },
}

const exBeneficiaryUser: UserProfileResponse = {
  ...user,
  depositExpirationDate: '2020-01-01T03:04:05',
}

const notBeneficiaryUser = {
  ...user,
  isBeneficiary: false,
}
const exUnderageBeneficiaryUser: UserProfileResponse = {
  ...user,
  depositExpirationDate: '2020-01-01T03:04:05',
  isEligibleForBeneficiaryUpgrade: true,
}

jest.mock('features/profile/api/useUpdateProfileMutation')
jest.mock('features/profile/helpers/isUserUnderageBeneficiary')
const mockedisUserUnderageBeneficiary = jest.mocked(isUserUnderageBeneficiary)

jest.mock('features/auth/context/AuthContext', () => ({
  useAuthContext: jest.fn(() => ({ isLoggedIn: true })),
}))

describe('ProfileHeader', () => {
  beforeEach(() => {
    mockdate.set('2021-07-01T00:00:00Z')
  })

  it('should display the LoggedOutHeader if no user', () => {
    render(<ProfileHeader user={undefined} />)
    expect(screen).toMatchSnapshot()
  })

  it('should display the BeneficiaryHeader if user is beneficiary', () => {
    render(<ProfileHeader user={user} />)
    expect(screen.getByText('Profite de ton crédit jusqu’au')).toBeOnTheScreen()
  })

  it('should display the BeneficiaryHeader if user is underage beneficiary', () => {
    mockedisUserUnderageBeneficiary.mockReturnValueOnce(true)
    render(<ProfileHeader user={user} />)
    expect(screen.getByText('Profite de ton crédit jusqu’au')).toBeOnTheScreen()
  })

  it('should display the ExBeneficiary Header if credit is expired', () => {
    render(<ProfileHeader user={exBeneficiaryUser} />)
    expect(screen.getByText('Ton crédit a expiré le')).toBeOnTheScreen()
  })

  it('should display the NonBeneficiaryHeader Header if user is not beneficiary', () => {
    render(<ProfileHeader user={notBeneficiaryUser} />)
    expect(screen).toMatchSnapshot()
  })

  it('should display the NonBeneficiaryHeader Header if user is eligible exunderage beneficiary', () => {
    render(<ProfileHeader user={exUnderageBeneficiaryUser} />)
    expect(screen).toMatchSnapshot()
  })
})
