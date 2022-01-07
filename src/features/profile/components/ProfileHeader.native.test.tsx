import mockdate from 'mockdate'
import React from 'react'
import { mocked } from 'ts-jest/utils'

import { UserProfileResponse } from 'api/gen'
import { ProfileHeader } from 'features/profile/components/ProfileHeader'
import { isUserUnderageBeneficiary } from 'features/profile/utils'
import { render } from 'tests/utils'

jest.mock('./NonBeneficiaryHeader')

const user: UserProfileResponse = {
  bookedOffers: {},
  email: 'email2@domain.ext',
  firstName: 'Jean',
  isBeneficiary: true,
  dateOfBirth: '2003-01-01',
  depositExpirationDate: '2023-02-09T11:17:14.786670',
  domainsCredit: {
    all: { initial: 50000, remaining: 40000 },
    physical: { initial: 30000, remaining: 10000 },
    digital: { initial: 30000, remaining: 20000 },
  },
  lastName: '93 HNMM 2',
  id: 1234,
  needsToFillCulturalSurvey: true,
  isEligibleForBeneficiaryUpgrade: false,
  roles: [],
  showEligibleCard: false,
  subscriptions: {
    marketingEmail: true,
    marketingPush: true,
  },
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

jest.mock('features/home/api')
jest.mock('features/profile/utils')
const mockedisUserUnderageBeneficiary = mocked(isUserUnderageBeneficiary, true)

describe('ProfileHeader', () => {
  beforeEach(() => {
    mockdate.set('2021-07-01T00:00:00Z')
  })

  it('should display the LoggedOutHeader if no user', () => {
    const ProfileHeaderComponent = render(<ProfileHeader user={undefined} />)
    expect(ProfileHeaderComponent).toMatchSnapshot()
  })

  it('should display the BeneficiaryHeader if user is beneficiary', () => {
    const { getByTestId, getByText } = render(<ProfileHeader user={user} />)
    expect(getByTestId('beneficiary-header')).toBeTruthy()
    expect(getByText("crédit valable jusqu'au\u00a009/02/2023 à 11h17")).toBeTruthy()
  })

  it('should display the BeneficiaryHeader if user is underage beneficiary', () => {
    mockedisUserUnderageBeneficiary.mockReturnValueOnce(true)
    const { getByTestId, getByText } = render(<ProfileHeader user={user} />)
    expect(getByTestId('beneficiary-header')).toBeTruthy()
    expect(getByText("crédit valable jusqu'au\u00a009/02/2023")).toBeTruthy()
  })

  it('should display the ExBeneficiary Header if credit is expired', () => {
    const { getByTestId, getByText } = render(<ProfileHeader user={exBeneficiaryUser} />)
    expect(getByTestId('ex-beneficiary-header')).toBeTruthy()
    expect(getByText('crédit expiré le 01/01/2020 à 03h04')).toBeTruthy()
  })

  it('should display the NonBeneficiaryHeader Header if user is not beneficiary', () => {
    const ProfileHeaderComponent = render(<ProfileHeader user={notBeneficiaryUser} />)
    expect(ProfileHeaderComponent).toMatchSnapshot()
  })
  it('should display the NonBeneficiaryHeader Header if user is eligible exunderage beneficiary', () => {
    const ProfileHeaderComponent = render(<ProfileHeader user={exUnderageBeneficiaryUser} />)
    expect(ProfileHeaderComponent).toMatchSnapshot()
  })
})
