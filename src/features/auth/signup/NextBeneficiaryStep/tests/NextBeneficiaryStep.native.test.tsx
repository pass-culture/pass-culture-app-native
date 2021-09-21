import React from 'react'

import { NextBeneficiaryStep } from 'features/auth/signup/NextBeneficiaryStep'
import { render } from 'tests/utils'

jest.mock('features/auth/settings')

const mockData: unknown = null
jest.mock('features/home/api', () => ({
  useUserProfileInfo: jest.fn(() => ({
    refetch: jest.fn(() => Promise.resolve({ data: mockData })),
  })),
}))

describe('<NextBeneficiaryStep />', () => {
  it('should show a loading page on init', () => {
    const renderAPI = render(<NextBeneficiaryStep />)
    expect(renderAPI.getByTestId('Loading-Animation')).toBeTruthy()
  })
})
