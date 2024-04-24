import React from 'react'

import { dispatch, navigate } from '__mocks__/@react-navigation/native'
import { SubscriptionStep, SubscriptionStepperResponseV2 } from 'api/gen'
import { subscriptionStepperFixture as mockStep } from 'features/identityCheck/fixtures/subscriptionStepperFixture'
import { IdentityCheckEnd } from 'features/identityCheck/pages/identification/ubble/IdentityCheckEnd'
import { navigateToHome } from 'features/navigation/helpers'
import { analytics } from 'libs/analytics'
import { render, screen, waitFor } from 'tests/utils'

jest.mock('features/navigation/helpers')

let mockStepperResponse: Partial<SubscriptionStepperResponseV2> = {
  ...mockStep,
  nextSubscriptionStep: SubscriptionStep['honor-statement'],
}

jest.mock('features/identityCheck/api/useGetStepperInfo', () => ({
  useGetStepperInfo: jest.fn(() => ({
    data: mockStepperResponse,
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

jest.useFakeTimers()

describe('<IdentityCheckEnd/>', () => {
  it('should render correctly', () => {
    render(<IdentityCheckEnd />)

    expect(screen).toMatchSnapshot()
  })

  it('should navigate to stepper after timeout if nextSubscriptionStep is not null', async () => {
    render(<IdentityCheckEnd />)

    expect(navigate).not.toHaveBeenCalled()

    jest.advanceTimersByTime(3000)

    await waitFor(() => {
      expect(dispatch).toHaveBeenCalledWith({
        payload: { index: 1, routes: [{ name: 'TabNavigator' }, { name: 'Stepper' }] },
        type: 'RESET',
      })
    })
  })

  it('should navigate to home after timeout if nextSubscriptionStep is null', () => {
    mockStepperResponse = {
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
