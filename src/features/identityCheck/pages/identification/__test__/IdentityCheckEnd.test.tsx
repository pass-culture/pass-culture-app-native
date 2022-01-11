import React from 'react'

import { IdentityCheckMethod, NextSubscriptionStepResponse, SubscriptionStep } from 'api/gen'
import { IdentityCheckEnd } from 'features/identityCheck/pages/identification/IdentityCheckEnd'
import { navigateToHome } from 'features/navigation/helpers'
import { render } from 'tests/utils'

jest.mock('features/navigation/helpers')
const mockNavigateToNextScreen = jest.fn()
jest.mock('features/identityCheck/useIdentityCheckNavigation', () => ({
  useIdentityCheckNavigation: () => ({
    navigateToNextScreen: mockNavigateToNextScreen,
  }),
}))

let mockNextSubscriptionStep: NextSubscriptionStepResponse = {
  allowedIdentityCheckMethods: [IdentityCheckMethod.ubble],
  nextSubscriptionStep: SubscriptionStep['honor-statement'],
  hasIdentityCheckPending: false,
}

jest.mock('features/auth/signup/nextSubscriptionStep', () => ({
  useNextSubscriptionStep: jest.fn(() => ({
    data: mockNextSubscriptionStep,
  })),
}))

describe('<IdentityCheckEnd/>', () => {
  beforeAll(() => jest.useFakeTimers())
  afterAll(() => jest.useRealTimers())

  it('should render correctly', () => {
    const renderAPI = render(<IdentityCheckEnd />)
    expect(renderAPI).toMatchSnapshot()
  })

  it('should navigate to next screen after timeout if nextSubscriptionStep is not null', () => {
    render(<IdentityCheckEnd />)
    expect(mockNavigateToNextScreen).not.toHaveBeenCalled()
    jest.advanceTimersByTime(3000)
    expect(mockNavigateToNextScreen).toHaveBeenCalledTimes(1)
  })

  it('should navigate to home after timeout if nextSubscriptionStep is null', () => {
    mockNextSubscriptionStep = {
      allowedIdentityCheckMethods: [IdentityCheckMethod.ubble],
      nextSubscriptionStep: null,
      hasIdentityCheckPending: false,
    }
    render(<IdentityCheckEnd />)
    expect(navigateToHome).not.toHaveBeenCalled()
    jest.advanceTimersByTime(3000)
    expect(navigateToHome).toHaveBeenCalledTimes(1)
  })
})
