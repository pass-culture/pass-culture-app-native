import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'

import { navigate, reset } from '__mocks__/@react-navigation/native'
import { OnboardingStackParamList } from 'features/navigation/OnboardingStackNavigator/OnboardingStackTypes'
import { StepperOrigin } from 'features/navigation/RootNavigator/types'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import * as useGoBack from 'features/navigation/useGoBack'
import { CreditStatus } from 'features/onboarding/enums'
import { OnboardingAgeInformation } from 'features/onboarding/pages/onboarding/OnboardingAgeInformation'
import { analytics } from 'libs/analytics/provider'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { eventMonitoring } from 'libs/monitoring/services'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { userEvent, render, screen } from 'tests/utils'

jest.spyOn(useGoBack, 'useGoBack').mockReturnValue({
  goBack: jest.fn(),
  canGoBack: jest.fn(() => true),
})

const AGES = [17, 18]

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const user = userEvent.setup()
jest.useFakeTimers()

describe('OnboardingAgeInformation', () => {
  beforeEach(() => {
    setFeatureFlags([RemoteStoreFeatureFlags.ENABLE_PACIFIC_FRANC_CURRENCY])
  })

  it('should navigate to Home and send log when route.params are undefined', () => {
    renderOnboardingAgeInformation(undefined)

    expect(reset).toHaveBeenCalledWith({
      index: 0,
      routes: [{ name: homeNavConfig[0] }],
    })
    expect(eventMonitoring.captureException).toHaveBeenCalledWith('route.params.type is falsy')
  })

  it.each(AGES)('should render correctly for %s-year-old', (age) => {
    renderOnboardingAgeInformation({ age })

    expect(screen).toMatchSnapshot()
  })

  it.each(AGES)('should only display one active block for %s-year-old', (age) => {
    renderOnboardingAgeInformation({ age })
    const ongoingTags = screen.queryAllByText(CreditStatus.ONGOING)

    expect(ongoingTags).toHaveLength(1)
  })

  it.each(AGES)('should display correct amount of inactive blocks for %s-year-old', (age) => {
    renderOnboardingAgeInformation({ age })
    const goneTags = screen.queryAllByText(CreditStatus.GONE)

    expect(goneTags).toHaveLength(age - 17)
  })

  it.each(AGES)('should display correct amount of coming credit blocks for %s-year-old', (age) => {
    renderOnboardingAgeInformation({ age })
    const comingTags = screen.queryAllByText(CreditStatus.COMING)

    expect(comingTags).toHaveLength(18 - age)
  })

  it.each(AGES)(
    'should navigate to SignupForm when pressing "Créer un compte" for %s-year-old',
    async (age) => {
      renderOnboardingAgeInformation({ age })
      const signupButton = screen.getByTestId('Créer un compte')

      await user.press(signupButton)

      expect(navigate).toHaveBeenCalledWith('SignupForm', {
        from: StepperOrigin.TUTORIAL,
      })
    }
  )

  it.each(AGES)(
    'should reset navigation on go to Home when pressing "Plus tard" for %s-year-old',
    async (age) => {
      renderOnboardingAgeInformation({ age })
      const laterButton = screen.getByTestId('Plus tard')

      await user.press(laterButton)

      expect(reset).toHaveBeenCalledWith({
        index: 0,
        routes: [{ name: homeNavConfig[0] }],
      })
    }
  )

  it.each(AGES)('should log analytics when attempting to click on credit block', async (age) => {
    renderOnboardingAgeInformation({ age })

    const creditBlock = screen.getByText(`à ${age} ans`)

    await user.press(creditBlock)

    expect(analytics.logTrySelectDeposit).toHaveBeenCalledWith(age)
  })
})

const renderOnboardingAgeInformation = (navigationParams: { age: number } | undefined) => {
  const navProps = { route: { params: navigationParams } } as StackScreenProps<
    OnboardingStackParamList,
    'OnboardingAgeInformation'
  >
  return render(reactQueryProviderHOC(<OnboardingAgeInformation {...navProps} />))
}
