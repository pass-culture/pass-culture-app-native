import mockdate from 'mockdate'
import React from 'react'

import { UserProfileResponse } from 'api/gen'
import { ProfileHeader } from 'features/profile/components/ProfileHeader'
import { render } from 'tests/utils/web'

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
  isEligibleForBeneficiaryUpgrade: false,
  needsToFillCulturalSurvey: true,
  roles: [],
  showEligibleCard: false,
  subscriptions: {
    marketingEmail: true,
    marketingPush: true,
  },
}

jest.mock('features/home/api')

const exBeneficiaryUser: UserProfileResponse = {
  ...user,
  depositExpirationDate: '2020-01-01T03:04:05',
}

describe('ProfileHeader', () => {
  beforeEach(() => {
    mockdate.set('2021-07-01T00:00:00Z')
  })

  it('should display the BeneficiaryHeader if user is beneficiary', () => {
    const { getByTestId, getByText } = render(<ProfileHeader user={user} />)
    expect(getByTestId('beneficiary-header')).toBeTruthy()
    expect(getByText("crédit valable jusqu'au 09/02/2023 à 11h17")).toBeTruthy()
  })

  it('should display the ExBeneficiary Header if credit is expired', () => {
    const { getByTestId, getByText } = render(<ProfileHeader user={exBeneficiaryUser} />)
    expect(getByTestId('ex-beneficiary-header')).toBeTruthy()
    expect(getByText('crédit expiré le 01/01/2020 à 03h04')).toBeTruthy()
  })
})
