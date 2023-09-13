import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'

import { navigate, reset } from '__mocks__/@react-navigation/native'
import { TutorialRootStackParamList } from 'features/navigation/RootNavigator/types'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { CreditStatus, TutorialTypes } from 'features/tutorial/enums'
import { OnboardingAgeInformation } from 'features/tutorial/pages/onboarding/OnboardingAgeInformation'
import { analytics } from 'libs/analytics'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, waitFor } from 'tests/utils'

const AGES = [15, 16, 17, 18]

describe('OnboardingAgeInformation', () => {
  it.each(AGES)('should render correctly for %s-year-old', (age) => {
    const renderAPI = renderOnboardingAgeInformation({ age })
    expect(renderAPI).toMatchSnapshot()
  })

  it.each(AGES)('should only display one active block for %s-year-old', (age) => {
    const { queryAllByText } = renderOnboardingAgeInformation({ age })
    const ongoingTags = queryAllByText(CreditStatus.ONGOING)

    expect(ongoingTags).toHaveLength(1)
  })

  it.each(AGES)('should display correct amount of inactive blocks for %s-year-old', (age) => {
    const { queryAllByText } = renderOnboardingAgeInformation({ age })
    const goneTags = queryAllByText(CreditStatus.GONE)

    expect(goneTags).toHaveLength(age - 15)
  })

  it.each(AGES)('should display correct amount of coming credit blocks for %s-year-old', (age) => {
    const { queryAllByText } = renderOnboardingAgeInformation({ age })
    const comingTags = queryAllByText(CreditStatus.COMING)

    expect(comingTags).toHaveLength(18 - age)
  })

  it.each(AGES)(
    'should navigate to SignupForm when pressing "Créer un compte" for %s-year-old',
    async (age) => {
      const { getByTestId } = renderOnboardingAgeInformation({ age })
      const signupButton = getByTestId('Créer un compte')

      fireEvent.press(signupButton)

      await waitFor(() => {
        expect(navigate).toHaveBeenCalledWith('SignupForm', { preventCancellation: true })
      })
    }
  )

  it.each(AGES)(
    'should reset navigation on go to Home when pressing "Plus tard" for %s-year-old',
    (age) => {
      const { getByTestId } = renderOnboardingAgeInformation({ age })
      const laterButton = getByTestId('Plus tard')

      fireEvent.press(laterButton)
      expect(reset).toHaveBeenCalledWith({ index: 0, routes: [{ name: homeNavConfig[0] }] })
    }
  )

  it.each(AGES)('should log analytics when attempting to click on credit block', (age) => {
    const { getByText } = renderOnboardingAgeInformation({ age })

    const creditBlock = getByText(`à ${age} ans`)

    fireEvent.press(creditBlock)
    expect(analytics.logTrySelectDeposit).toHaveBeenCalledWith(age)
  })

  it.each(AGES)('should log analytics when clicking on signup button', (age) => {
    const { getByText } = renderOnboardingAgeInformation({ age })

    const signupButton = getByText('Créer un compte')

    fireEvent.press(signupButton)
    expect(analytics.logOnboardingAgeInformationClicked).toHaveBeenNthCalledWith(1, {
      type: 'account_creation',
    })
    expect(analytics.logSignUpClicked).toHaveBeenNthCalledWith(1, {
      from: TutorialTypes.ONBOARDING,
    })
  })

  it.each(AGES)('should log analytics when clicking on skip button', (age) => {
    const { getByText } = renderOnboardingAgeInformation({ age })

    const laterButton = getByText('Plus tard')

    fireEvent.press(laterButton)
    expect(analytics.logOnboardingAgeInformationClicked).toHaveBeenNthCalledWith(1, {
      type: 'account_creation_skipped',
    })
  })
})

const renderOnboardingAgeInformation = (navigationParams: { age: number }) => {
  const navProps = { route: { params: navigationParams } } as StackScreenProps<
    TutorialRootStackParamList,
    'OnboardingAgeInformation'
  >
  return render(
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    reactQueryProviderHOC(<OnboardingAgeInformation {...navProps} />)
  )
}
