import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'

import { navigate, reset } from '__mocks__/@react-navigation/native'
import * as SettingsContextAPI from 'features/auth/context/SettingsContext'
import { defaultSettings } from 'features/auth/fixtures/fixtures'
import { StepperOrigin, TutorialRootStackParamList } from 'features/navigation/RootNavigator/types'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import * as useGoBack from 'features/navigation/useGoBack'
import { CreditStatus, TutorialTypes } from 'features/tutorial/enums'
import { OnboardingAgeInformation } from 'features/tutorial/pages/onboarding/OnboardingAgeInformation'
import { analytics } from 'libs/analytics'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/__tests__/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { userEvent, render, screen } from 'tests/utils'

jest.spyOn(useGoBack, 'useGoBack').mockReturnValue({
  goBack: jest.fn(),
  canGoBack: jest.fn(() => true),
})

const AGES = [15, 16, 17, 18]

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

    expect(goneTags).toHaveLength(age - 15)
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

  it.each(AGES)('should log analytics when clicking on signup button', async (age) => {
    renderOnboardingAgeInformation({ age })

    const signupButton = screen.getByText('Créer un compte')

    await user.press(signupButton)

    expect(analytics.logOnboardingAgeInformationClicked).toHaveBeenNthCalledWith(1, {
      type: 'account_creation',
    })
    expect(analytics.logSignUpClicked).toHaveBeenNthCalledWith(1, {
      from: TutorialTypes.ONBOARDING,
    })
  })

  it.each(AGES)('should log analytics when clicking on skip button', async (age) => {
    renderOnboardingAgeInformation({ age })

    const laterButton = screen.getByText('Plus tard')

    await user.press(laterButton)

    expect(analytics.logOnboardingAgeInformationClicked).toHaveBeenNthCalledWith(1, {
      type: 'account_creation_skipped',
    })
  })

  describe('when enableCreditV3 activated', () => {
    beforeEach(() => {
      jest.spyOn(SettingsContextAPI, 'useSettingsContext').mockReturnValue({
        data: { ...defaultSettings, wipEnableCreditV3: true },
        isLoading: false,
      })
    })

    it.each(AGES)('should render correctly for %s-year-old', (age) => {
      renderOnboardingAgeInformation({ age })

      expect(screen).toMatchSnapshot()
    })
  })
})

const renderOnboardingAgeInformation = (navigationParams: { age: number }) => {
  const navProps = { route: { params: navigationParams } } as StackScreenProps<
    TutorialRootStackParamList,
    'OnboardingAgeInformation'
  >
  return render(reactQueryProviderHOC(<OnboardingAgeInformation {...navProps} />))
}
