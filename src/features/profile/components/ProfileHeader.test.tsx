import { render } from '@testing-library/react-native'
import React from 'react'

import { UserProfileResponse } from 'api/gen'
import { ProfileHeader } from 'features/profile/components/ProfileHeader'

const user: UserProfileResponse = {
  bookedOffers: {},
  email: 'email2@domain.ext',
  firstName: 'Jean',
  isBeneficiary: true,
  dateOfBirth: '2003-01-01',
  depositExpirationDate: new Date('2023-02-09T11:17:14.786670'),
  domainsCredit: {
    all: { initial: 50000, remaining: 40000 },
    physical: { initial: 30000, remaining: 10000 },
    digital: { initial: 30000, remaining: 20000 },
  },
  expenses: [],
  lastName: '93 HNMM 2',
  id: 1234,
  needsToFillCulturalSurvey: true,
  showEligibleCard: false,
  subscriptions: {
    marketingEmail: true,
    marketingPush: true,
  },
}

const exBeneficiaryUser: UserProfileResponse = {
  ...user,
  depositExpirationDate: new Date('2020-01-01T00:00:00'),
}

describe('ProfileHeader', () => {
  it('should display the BeneficiaryHeader if user is beneficiary', () => {
    const { getByTestId } = render(<ProfileHeader user={user} />)
    expect(getByTestId('beneficiary-header')).toBeTruthy()
  })

  it('should display the ExBeneficiary Header if credit is expired', () => {
    const { getByTestId } = render(<ProfileHeader user={exBeneficiaryUser} />)
    expect(getByTestId('ex-beneficiary-header')).toBeTruthy()
  })
})
