import { StackScreenProps } from '@react-navigation/stack'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { useSettingsContext } from 'features/auth/context/SettingsContext'
import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { TutorialRootStackParamList } from 'features/navigation/RootNavigator/types'
import { AgeButton } from 'features/tutorial/components/AgeButton'
import { useOnboardingContext } from 'features/tutorial/context/OnboardingWrapper'
import { NonEligible, TutorialTypes } from 'features/tutorial/enums'
import { TutorialPage } from 'features/tutorial/pages/TutorialPage'
import { EligibleAges } from 'features/tutorial/types'
import { analytics } from 'libs/analytics/provider'
import { storage } from 'libs/storage'
import { AccessibleUnorderedList } from 'ui/components/accessibility/AccessibleUnorderedList'
import { InternalNavigationProps } from 'ui/components/touchableLink/types'
import { Spacer, Typo } from 'ui/theme'
import { getNoHeadingAttrs } from 'ui/theme/typographyAttrs/getNoHeadingAttrs'

type AgeButtonProps = {
  startButtonTitle: string
  age: string
  endButtonTitle: string
  navigateTo: InternalNavigationProps['navigateTo']
  onBeforeNavigate?: () => Promise<void>
}

const isNotEligible = (age: NonEligible | EligibleAges): age is NonEligible => {
  return age in NonEligible
}

type Props = StackScreenProps<TutorialRootStackParamList, 'AgeSelectionFork'>

export const AgeSelectionFork: FunctionComponent<Props> = ({ route }: Props) => {
  const { data: settings } = useSettingsContext()
  const enableCreditV3 = settings?.wipEnableCreditV3

  const type = route.params.type
  const isOnboarding = type === TutorialTypes.ONBOARDING

  const { showNotEligibleModal } = useOnboardingContext()

  const onAgeChoice = async (age: NonEligible | EligibleAges) => {
    if (isNotEligible(age)) {
      showNotEligibleModal(age, type)
    }

    analytics.logSelectAge({ age, from: type })
    if (isOnboarding) await storage.saveObject('user_age', age)
  }

  const ageButtonsV2: AgeButtonProps[] = [
    {
      startButtonTitle: 'J’ai ',
      age: '14 ans',
      endButtonTitle: ' ou moins',
      navigateTo: navigateToHomeConfig,
      onBeforeNavigate: () => onAgeChoice(NonEligible.UNDER_15),
    },
    {
      startButtonTitle: 'J’ai entre ',
      age: '15 et 18 ans',
      endButtonTitle: '',
      navigateTo: { screen: 'EligibleUserAgeSelection' },
    },
    {
      startButtonTitle: 'J’ai ',
      age: '19 ans',
      endButtonTitle: ' ou plus',
      navigateTo: { screen: 'OnboardingGeneralPublicWelcome' },
      onBeforeNavigate: () => onAgeChoice(NonEligible.OVER_18),
    },
  ]

  const ageButtonsV3: AgeButtonProps[] = [
    {
      startButtonTitle: 'J’ai ',
      age: '16 ans',
      endButtonTitle: ' ou moins',
      navigateTo: { screen: 'OnboardingNotEligible' },
      onBeforeNavigate: () => onAgeChoice(NonEligible.UNDER_17),
    },
    {
      startButtonTitle: 'J’ai ',
      age: '17 ans',
      endButtonTitle: '',
      navigateTo: { screen: 'OnboardingAgeInformation', params: { age: 17 } },
      onBeforeNavigate: () => onAgeChoice(17),
    },
    {
      startButtonTitle: 'J’ai ',
      age: '18 ans',
      endButtonTitle: '',
      navigateTo: { screen: 'OnboardingAgeInformation', params: { age: 18 } },
      onBeforeNavigate: () => onAgeChoice(18),
    },
    {
      startButtonTitle: 'J’ai ',
      age: '19 ans',
      endButtonTitle: ' ou plus',
      navigateTo: { screen: 'OnboardingGeneralPublicWelcome' },
      onBeforeNavigate: () => onAgeChoice(NonEligible.OVER_18),
    },
  ]

  const ageButtons = enableCreditV3 ? ageButtonsV3 : ageButtonsV2

  return (
    <TutorialPage title="Pour commencer, peux-tu nous dire ton âge&nbsp;?">
      <AccessibleUnorderedList
        items={ageButtons.map((button) => (
          <AgeButton
            key={button.age}
            onBeforeNavigate={button.onBeforeNavigate}
            navigateTo={{
              screen: button.navigateTo.screen,
              params: { ...button.navigateTo.params, type },
            }}
            accessibilityLabel={`${button.startButtonTitle}${button.age}${button.endButtonTitle}`}>
            <StyledBody>
              {button.startButtonTitle}
              <StyledTitle4>{button.age}</StyledTitle4>
              {button.endButtonTitle}
            </StyledBody>
          </AgeButton>
        ))}
        Separator={<Spacer.Column numberOfSpaces={4} />}
      />
    </TutorialPage>
  )
}

const StyledTitle4 = styled(Typo.Title4).attrs(getNoHeadingAttrs)(({ theme }) => ({
  color: theme.colors.secondary,
}))

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.secondary,
}))
