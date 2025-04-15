import { StackScreenProps } from '@react-navigation/stack'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { navigateToHome } from 'features/navigation/helpers/navigateToHome'
import { getOnboardingNavConfig } from 'features/navigation/OnboardingStackNavigator/getOnboardingNavConfig'
import { OnboardingStackParamList } from 'features/navigation/OnboardingStackNavigator/OnboardingStackTypes'
import { AgeButton } from 'features/tutorial/components/AgeButton'
import { useOnboardingContext } from 'features/tutorial/context/OnboardingWrapper'
import { NonEligible, TutorialTypes } from 'features/tutorial/enums'
import { TutorialPage } from 'features/tutorial/pages/TutorialPage'
import { EligibleAges } from 'features/tutorial/types'
import { analytics } from 'libs/analytics/provider'
import { eventMonitoring } from 'libs/monitoring/services'
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

type Props = StackScreenProps<OnboardingStackParamList, 'AgeSelectionFork'>

export const AgeSelectionFork: FunctionComponent<Props> = ({ route }: Props) => {
  const { showNotEligibleModal } = useOnboardingContext()

  const type = route?.params?.type

  if (!type) {
    eventMonitoring.captureException('route.params.type is falsy')
    navigateToHome()
    return null
  }

  const isOnboarding = type === TutorialTypes.ONBOARDING

  const onAgeChoice = async (age: NonEligible | EligibleAges) => {
    if (isNotEligible(age)) {
      showNotEligibleModal(age, type)
    }

    analytics.logSelectAge({ age, from: type })
    if (isOnboarding) await storage.saveObject('user_age', age)
  }

  const ageButtons: AgeButtonProps[] = [
    {
      startButtonTitle: 'J’ai ',
      age: '16 ans',
      endButtonTitle: ' ou moins',
      navigateTo: getOnboardingNavConfig('OnboardingNotEligible'),
      onBeforeNavigate: () => onAgeChoice(NonEligible.UNDER_17),
    },
    {
      startButtonTitle: 'J’ai ',
      age: '17 ans',
      endButtonTitle: '',
      navigateTo: getOnboardingNavConfig('OnboardingAgeInformation', { age: 17 }),
      onBeforeNavigate: () => onAgeChoice(17),
    },
    {
      startButtonTitle: 'J’ai ',
      age: '18 ans',
      endButtonTitle: '',
      navigateTo: getOnboardingNavConfig('OnboardingAgeInformation', { age: 18 }),
      onBeforeNavigate: () => onAgeChoice(18),
    },
    {
      startButtonTitle: 'J’ai ',
      age: '19 ans',
      endButtonTitle: ' ou plus',
      navigateTo: getOnboardingNavConfig('OnboardingGeneralPublicWelcome'),
      onBeforeNavigate: () => onAgeChoice(NonEligible.OVER_18),
    },
  ]

  return (
    <TutorialPage title="Pour commencer, peux-tu nous dire ton âge&nbsp;?">
      <AccessibleUnorderedList
        items={ageButtons.map((button) => (
          <AgeButton
            key={button.age}
            onBeforeNavigate={button.onBeforeNavigate}
            navigateTo={button.navigateTo}
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
  color: theme.designSystem.color.text.brandSecondary,
}))

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.designSystem.color.text.brandSecondary,
}))
