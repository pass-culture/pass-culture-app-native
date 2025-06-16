import React from 'react'
import { act } from 'react-test-renderer'

import { dispatch, navigate } from '__mocks__/@react-navigation/native'
import { SubscriptionStep, SubscriptionStepperResponseV2 } from 'api/gen'
import { subscriptionStepperFixture as mockStep } from 'features/identityCheck/fixtures/subscriptionStepperFixture'
import { IdentityCheckEnd } from 'features/identityCheck/pages/identification/ubble/IdentityCheckEnd'
import { navigateToHome } from 'features/navigation/helpers/navigateToHome'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, waitFor } from 'tests/utils'

jest.mock('features/navigation/helpers/navigateToHome')
jest.mock('libs/jwt/jwt')
jest.mock('features/auth/context/AuthContext', () => ({
  useAuthContext: jest.fn(() => ({ isLoggedIn: true })),
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
  beforeEach(() => {
    mockServer.getApi<SubscriptionStepperResponseV2>('/v2/subscription/stepper', mockStep)
  })

  it('should render correctly', async () => {
    renderGetStepperInfo()
    await act(async () => {})

    expect(screen).toMatchSnapshot()
  })

  it.skip('should navigate to stepper after timeout if nextSubscriptionStep is not null', async () => {
    mockServer.getApi<SubscriptionStepperResponseV2>('/v2/subscription/stepper', {
      ...mockStep,
      nextSubscriptionStep: SubscriptionStep['honor-statement'],
    })

    renderGetStepperInfo()
    await act(async () => {})

    expect(navigate).not.toHaveBeenCalled()

    jest.advanceTimersByTime(3000)

    await waitFor(() =>
      expect(dispatch).toHaveBeenCalledWith({
        payload: { index: 1, routes: [{ name: 'TabNavigator' }, { name: 'Stepper' }] },
        type: 'RESET',
      })
    )
  })

  it('should navigate to home after timeout if nextSubscriptionStep is null', async () => {
    mockServer.getApi<SubscriptionStepperResponseV2>('/v2/subscription/stepper', {
      ...mockStep,
      nextSubscriptionStep: null,
    })
    renderGetStepperInfo()
    await act(async () => {})

    expect(navigateToHome).not.toHaveBeenCalled()

    jest.advanceTimersByTime(3000)

    await waitFor(() => expect(navigateToHome).toHaveBeenCalledTimes(1))
  })
})

const renderGetStepperInfo = () => render(reactQueryProviderHOC(<IdentityCheckEnd />))
