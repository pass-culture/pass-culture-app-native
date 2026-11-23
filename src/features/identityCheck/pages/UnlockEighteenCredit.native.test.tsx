import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { IdentityCheckMethod, SubscriptionStepperResponseV3 } from 'api/gen'
import { subscriptionStepperFixture } from 'features/identityCheck/fixtures/subscriptionStepperFixture'
import { UnlockEighteenCredit } from 'features/identityCheck/pages/UnlockEighteenCredit'
import { beneficiaryUser, nonBeneficiaryUser } from 'fixtures/user'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { storage } from 'libs/storage'
import { mockAuthContextWithUser } from 'tests/AuthContextUtils'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent } from 'tests/utils'

jest.mock('features/auth/context/AuthContext')
jest.mock('libs/firebase/analytics/analytics')
let mockStepperData: SubscriptionStepperResponseV3 | undefined
jest.mock('features/identityCheck/queries/useGetStepperInfoQuery', () => ({
  useGetStepperInfoQuery: () => ({ data: mockStepperData }),
}))

afterEach(() => {
  storage.clear('has_seen_eligible_card')
})

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

jest.useFakeTimers()

describe('<UnlockEighteenCredit />', () => {
  beforeEach(() => {
    setFeatureFlags()
    mockStepperData = undefined
  })

  it.each([
    { enabled: true, initial: 5000, method: IdentityCheckMethod.ubble, target: 'CheckAddress' },
    { enabled: true, initial: 5000, method: IdentityCheckMethod.dms, target: 'CheckAddress' },
    { enabled: true, initial: 5000, method: IdentityCheckMethod.educonnect, target: 'Stepper' },
    { enabled: false, initial: 5000, method: IdentityCheckMethod.ubble, target: 'Stepper' },
    { enabled: true, initial: 0, method: IdentityCheckMethod.ubble, target: 'Stepper' },
  ])(
    'should navigate to $target with flag=$enabled, initial=$initial, method=$method',
    async ({ enabled, initial, method, target }) => {
      setFeatureFlags(enabled ? [RemoteStoreFeatureFlags.WIP_SIMPLIFIED_ACTIVATION_18] : [])
      mockAuthContextWithUser(
        { ...beneficiaryUser, domainsCredit: { all: { initial, remaining: 0 } } },
        { persist: true }
      )
      mockStepperData = { ...subscriptionStepperFixture, underageOkIdentityCheckMethod: method }

      render(reactQueryProviderHOC(<UnlockEighteenCredit />))
      await userEvent
        .setup()
        .press(
          screen.getByText(
            enabled && initial > 0 ? 'Débloquer mon crédit' : 'Confirmer mes informations'
          )
        )

      expect(navigate).toHaveBeenCalledWith('SubscriptionStackNavigator', {
        params: undefined,
        screen: target,
      })
    }
  )

  it('should render eighteen birthday', () => {
    render(reactQueryProviderHOC(<UnlockEighteenCredit />))

    expect(screen).toMatchSnapshot()
  })

  it('should set `has_seen_eligible_card` to true in storage', async () => {
    expect(await storage.readObject('has_seen_eligible_card')).toBeNull()

    render(reactQueryProviderHOC(<UnlockEighteenCredit />))

    expect(await storage.readObject('has_seen_eligible_card')).toBe(true)
  })

  it('should navigate to Stepper on button press', async () => {
    render(reactQueryProviderHOC(<UnlockEighteenCredit />))

    await userEvent.setup().press(screen.getByText('Confirmer mes informations'))

    expect(navigate).toHaveBeenCalledWith('SubscriptionStackNavigator', {
      params: undefined,
      screen: 'Stepper',
    })
  })

  it('should render right wording when user require IdCheck', () => {
    mockAuthContextWithUser({ ...nonBeneficiaryUser, requiresIdCheck: true })

    render(reactQueryProviderHOC(<UnlockEighteenCredit />))

    expect(screen.getByText('Vérifie ton identité pour débloquer tes 150 €.')).toBeOnTheScreen()
    expect(screen.getByText('Vérifier mon identité')).toBeOnTheScreen()
  })

  it('should render illustration rather than animation when wipNewVisionUi FF activated', () => {
    setFeatureFlags([RemoteStoreFeatureFlags.WIP_NEW_VISION_UI])

    render(reactQueryProviderHOC(<UnlockEighteenCredit />))

    expect(screen.getByTestId('remote-illustration')).toBeOnTheScreen()
  })
})
