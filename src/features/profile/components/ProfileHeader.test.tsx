import { render } from '@testing-library/react-native'
import React from 'react'

import { ExpenseDomain, UserProfileResponse } from 'api/gen'
import { ProfileHeader } from 'features/profile/components/ProfileHeader'

const userV1: UserProfileResponse = {
  email: 'email2@domain.ext',
  firstName: 'Jean',
  isBeneficiary: true,
  dateOfBirth: new Date('2003-01-01T00:00:00'),
  depositExpirationDate: new Date('2023-02-09T11:17:14.786670'),
  depositVersion: 1,
  expenses: [
    { current: 30000, domain: ExpenseDomain.All, limit: 30000 },
    { current: 0, domain: ExpenseDomain.Digital, limit: 10000 },
    { current: 0, domain: ExpenseDomain.Physical, limit: 10000 },
  ],
  isEligible: true,
  lastName: '93 HNMM 2',
  id: 1234,
  needsToFillCulturalSurvey: true,
  showEligibleCard: false,
  subscriptions: {
    marketing_email: true,
    marketing_push: true,
  },
}

const userV2: UserProfileResponse = {
  ...userV1,
  depositVersion: 2,
  expenses: [
    { current: 30000, domain: ExpenseDomain.All, limit: 30000 },
    { current: 0, domain: ExpenseDomain.Digital, limit: 10000 },
  ],
}

const exBeneficiaryUser: UserProfileResponse = {
  ...userV1,
  depositExpirationDate: new Date('2020-01-01T00:00:00'),
}

describe('ProfileHeader', () => {
  it('should display the BeneficiaryHeader version 1 if user is beneficiary and depositVersion = 1', () => {
    const { getByTestId } = render(<ProfileHeader user={userV1} />)
    expect(getByTestId('beneficiary-header-1')).toBeTruthy()
  })

  it('should display the BeneficiaryHeader version 2 if user is beneficiary and depositVersion = 2', () => {
    const { getByTestId } = render(<ProfileHeader user={userV2} />)
    expect(getByTestId('beneficiary-header-2')).toBeTruthy()
  })

  it('should display the ExBeneficiary Header if credit is expired', () => {
    const { getByTestId } = render(<ProfileHeader user={exBeneficiaryUser} />)
    expect(getByTestId('ex-beneficiary-header')).toBeTruthy()
  })
})
