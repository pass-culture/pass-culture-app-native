import React from 'react'

import { CommonActions, dispatch, navigate } from '__mocks__/@react-navigation/native'
import { NextSubscriptionStepResponse, SubscriptionStep } from 'api/gen'
import { nextSubscriptionStepFixture as mockStep } from 'features/identityCheck/fixtures/nextSubscriptionStepFixture'
import { IdentityCheckEnd } from 'features/identityCheck/pages/identification/ubble/IdentityCheckEnd'
import { navigateToHome } from 'features/navigation/helpers'
import { analytics } from 'libs/analytics'
import { render, waitFor } from 'tests/utils'

jest.mock('features/navigation/helpers')

let mockNextSubscriptionStep: NextSubscriptionStepResponse = {
  ...mockStep,
  nextSubscriptionStep: SubscriptionStep['honor-statement'],
}

jest.mock('features/auth/api/useNextSubscriptionStep', () => ({
  useNextSubscriptionStep: jest.fn(() => ({
    data: mockNextSubscriptionStep,
  })),
}))

const mockDispatch = jest.fn()
jest.mock('features/identityCheck/context/SubscriptionContextProvider', () => ({
  useSubscriptionContext: () => ({
    dispatch: mockDispatch,
    identification: {
      done: true,
      firstName: 'John',
      lastName: 'Doe',
      birthDate: '02/02/2006',
      method: 'ubble',
    },
  }),
}))

describe('<IdentityCheckEnd/>', () => {
  beforeAll(() => jest.useFakeTimers('legacy'))
  afterAll(() => jest.useRealTimers())

  it('should render correctly', () => {
    const renderAPI = render(<IdentityCheckEnd />)
    expect(renderAPI).toMatchSnapshot()
  })

  it('should navigate to stepper after timeout if nextSubscriptionStep is not null', async () => {
    render(<IdentityCheckEnd />)
    expect(navigate).not.toHaveBeenCalled()
    jest.advanceTimersByTime(3000)

    await waitFor(() => {
      expect(dispatch).toHaveBeenCalledTimes(1)
      expect(CommonActions.reset).toHaveBeenCalledWith({
        index: 1,
        routes: [{ name: 'TabNavigator' }, { name: 'Stepper' }],
      })
    })
  })

  it('should navigate to home after timeout if nextSubscriptionStep is null', () => {
    mockNextSubscriptionStep = {
      ...mockStep,
      nextSubscriptionStep: null,
    }
    render(<IdentityCheckEnd />)
    expect(navigateToHome).not.toHaveBeenCalled()
    jest.advanceTimersByTime(3000)
    expect(navigateToHome).toHaveBeenCalledTimes(1)
  })

  it('should log screen view when the screen is mounted', async () => {
    render(<IdentityCheckEnd />)

    await waitFor(() => expect(analytics.logScreenViewIdentityCheckEnd).toHaveBeenCalledTimes(1))
  })
})
