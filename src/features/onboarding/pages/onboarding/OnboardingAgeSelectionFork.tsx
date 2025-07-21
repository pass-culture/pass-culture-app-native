import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { getOnboardingPropConfig } from 'features/navigation/OnboardingStackNavigator/getOnboardingPropConfig'
import { AgeButton } from 'features/onboarding/components/AgeButton'
import { NonEligible } from 'features/onboarding/enums'
import { EligibleAges } from 'features/onboarding/types'
import { TutorialPage } from 'features/profile/pages/Tutorial/TutorialPage'
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

export const OnboardingAgeSelectionFork: FunctionComponent = () => {
  const onAgeChoice = async (age: NonEligible | EligibleAges) => {
    analytics.logSelectAge({ age })
    await storage.saveObject('user_age', age)
  }

  const ageButtons: AgeButtonProps[] = [
    {
      startButtonTitle: 'J’ai ',
      age: '16 ans',
      endButtonTitle: ' ou moins',
      navigateTo: getOnboardingPropConfig('OnboardingNotEligible'),
      onBeforeNavigate: () => onAgeChoice(NonEligible.UNDER_17),
    },
    {
      startButtonTitle: 'J’ai ',
      age: '17 ans',
      endButtonTitle: '',
      navigateTo: getOnboardingPropConfig('OnboardingAgeInformation', { age: 17 }),
      onBeforeNavigate: () => onAgeChoice(17),
    },
    {
      startButtonTitle: 'J’ai ',
      age: '18 ans',
      endButtonTitle: '',
      navigateTo: getOnboardingPropConfig('OnboardingAgeInformation', { age: 18 }),
      onBeforeNavigate: () => onAgeChoice(18),
    },
    {
      startButtonTitle: 'J’ai ',
      age: '19 ans',
      endButtonTitle: ' ou plus',
      navigateTo: getOnboardingPropConfig('OnboardingGeneralPublicWelcome'),
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
