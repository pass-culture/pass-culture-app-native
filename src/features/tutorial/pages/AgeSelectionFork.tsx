import { StackScreenProps } from '@react-navigation/stack'
import React, { FunctionComponent, useCallback } from 'react'
import styled from 'styled-components/native'

import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { TutorialRootStackParamList } from 'features/navigation/RootNavigator/types'
import { AgeButton } from 'features/tutorial/components/AgeButton'
import { useOnboardingContext } from 'features/tutorial/context/OnboardingWrapper'
import { NonEligible, TutorialTypes } from 'features/tutorial/enums'
import { TutorialPage } from 'features/tutorial/pages/TutorialPage'
import { storage } from 'libs/storage'
import { AccessibleUnorderedList } from 'ui/components/accessibility/AccessibleUnorderedList'
import { InternalNavigationProps } from 'ui/components/touchableLink/types'
import { Spacer, TypoDS } from 'ui/theme'
import { getNoHeadingAttrs } from 'ui/theme/typographyAttrs/getNoHeadingAttrs'

type AgeButtonProps = {
  startButtonTitle: string
  age: string
  endButtonTitle: string
  navigateTo: InternalNavigationProps['navigateTo']
  onBeforeNavigate?: () => Promise<void>
}

type Props = StackScreenProps<TutorialRootStackParamList, 'AgeSelectionFork'>

export const AgeSelectionFork: FunctionComponent<Props> = ({ route }: Props) => {
  const type = route.params.type
  const isOnboarding = type === TutorialTypes.ONBOARDING

  const { showNonEligibleModal } = useOnboardingContext()

  const onUnder15Press = useCallback(async () => {
    showNonEligibleModal(NonEligible.UNDER_15, type)
    if (isOnboarding) await storage.saveObject('user_age', NonEligible.UNDER_15)
  }, [type, isOnboarding, showNonEligibleModal])

  const onOver18Press = useCallback(async () => {
    showNonEligibleModal(NonEligible.OVER_18, type)
    if (isOnboarding) await storage.saveObject('user_age', NonEligible.OVER_18)
  }, [type, isOnboarding, showNonEligibleModal])

  const ageButtons: AgeButtonProps[] = [
    {
      startButtonTitle: 'J’ai ',
      age: '14 ans',
      endButtonTitle: ' ou moins',
      navigateTo: navigateToHomeConfig,
      onBeforeNavigate: onUnder15Press,
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
      onBeforeNavigate: onOver18Press,
    },
  ]

  return (
    <TutorialPage title="Pour commencer, peux-tu nous dire ton âge&nbsp;?">
      <AccessibleUnorderedList
        items={ageButtons.map((button) => (
          <AgeButton
            key={button.age}
            onBeforeNavigate={button.onBeforeNavigate}
            navigateTo={{ screen: button.navigateTo.screen, params: { type } }}
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

const StyledTitle4 = styled(TypoDS.Title4).attrs(getNoHeadingAttrs)(({ theme }) => ({
  color: theme.colors.secondary,
}))

const StyledBody = styled(TypoDS.Body)(({ theme }) => ({
  color: theme.colors.secondary,
}))