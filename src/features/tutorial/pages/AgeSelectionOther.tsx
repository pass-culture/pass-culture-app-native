import { useNavigation } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import React, { FunctionComponent, useCallback } from 'react'
import styled from 'styled-components/native'

import {
  UseNavigationType,
  TutorialRootStackParamList,
} from 'features/navigation/RootNavigator/types'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { OnboardingAgeButtonOther } from 'features/tutorial/components/onboarding/OnboardingAgeButtonOther'
import { ProfileTutorialAgeButtonOther } from 'features/tutorial/components/profileTutorial/ProfileTutorialAgeButtonOther'
import { useOnboardingContext } from 'features/tutorial/context/OnboardingWrapper'
import { NonEligible, TutorialTypes } from 'features/tutorial/enums'
import { TutorialPage } from 'features/tutorial/pages/TutorialPage'
import { analytics } from 'libs/analytics'
import { storage } from 'libs/storage'
import { Spacer, Typo } from 'ui/theme'
import { getNoHeadingAttrs } from 'ui/theme/typographyAttrs/getNoHeadingAttrs'

type Props = StackScreenProps<TutorialRootStackParamList, 'AgeSelection'>

export const AgeSelectionOther: FunctionComponent<Props> = ({ route }: Props) => {
  const type = route.params.type
  const isOnboarding = type === TutorialTypes.ONBOARDING

  const { showNonEligibleModal } = useOnboardingContext()
  const { reset } = useNavigation<UseNavigationType>()

  const onUnder15Press = useCallback(async () => {
    analytics.logSelectAge({ age: NonEligible.UNDER_15, from: type })
    showNonEligibleModal(NonEligible.UNDER_15, type)

    if (isOnboarding) {
      reset({ index: 0, routes: [{ name: homeNavConfig[0] }] })
      await storage.saveObject('user_age', NonEligible.UNDER_15)
    }
  }, [type, isOnboarding, showNonEligibleModal, reset])

  const onOver18Press = useCallback(async () => {
    analytics.logSelectAge({ age: NonEligible.OVER_18, from: type })
    showNonEligibleModal(NonEligible.OVER_18, type)

    if (isOnboarding) {
      reset({ index: 0, routes: [{ name: homeNavConfig[0] }] })
      await storage.saveObject('user_age', NonEligible.OVER_18)
    }
  }, [type, isOnboarding, showNonEligibleModal, reset])

  const title = isOnboarding ? 'Quel âge as-tu\u00a0?' : 'Comment ça marche\u00a0?'
  const startButtonTitle = isOnboarding ? 'j’ai' : 'à'
  const accessibilityLabelUnder15 = `${startButtonTitle} moins de 15 ans`
  const accessibilityLabelOver18 = `${startButtonTitle} plus de 18 ans`
  const endButtonTitleUnder15 = 'moins de 15 ans'
  const endButtonTitleOver18 = 'plus de 18 ans'

  return (
    <TutorialPage title={title}>
      {isOnboarding ? (
        <OnboardingAgeButtonOther
          type={type}
          onBeforeNavigate={onUnder15Press}
          accessibilityLabel={accessibilityLabelUnder15}>
          <AgeButtonContent
            startButtonTitle={startButtonTitle}
            endButtonTitle={endButtonTitleUnder15}
          />
        </OnboardingAgeButtonOther>
      ) : (
        <ProfileTutorialAgeButtonOther
          type={type}
          onPress={onUnder15Press}
          accessibilityLabel={accessibilityLabelUnder15}>
          <AgeButtonContent
            startButtonTitle={startButtonTitle}
            endButtonTitle={endButtonTitleUnder15}
          />
        </ProfileTutorialAgeButtonOther>
      )}
      <Spacer.Column numberOfSpaces={4} />
      {isOnboarding ? (
        <OnboardingAgeButtonOther
          type={type}
          onBeforeNavigate={onOver18Press}
          accessibilityLabel={accessibilityLabelOver18}>
          <AgeButtonContent
            startButtonTitle={startButtonTitle}
            endButtonTitle={endButtonTitleOver18}
          />
        </OnboardingAgeButtonOther>
      ) : (
        <ProfileTutorialAgeButtonOther
          type={type}
          onPress={onOver18Press}
          accessibilityLabel={accessibilityLabelOver18}>
          <AgeButtonContent
            startButtonTitle={startButtonTitle}
            endButtonTitle={endButtonTitleOver18}
          />
        </ProfileTutorialAgeButtonOther>
      )}
    </TutorialPage>
  )
}

const AgeButtonContent = ({
  startButtonTitle,
  endButtonTitle,
}: {
  startButtonTitle: string
  endButtonTitle: string
}) => (
  <Title4Text>
    {startButtonTitle}
    <Title3Text> {endButtonTitle}</Title3Text>
  </Title4Text>
)

const Title3Text = styled(Typo.Title3).attrs(getNoHeadingAttrs)(({ theme }) => ({
  color: theme.colors.secondary,
}))

const Title4Text = styled(Typo.Title4).attrs(getNoHeadingAttrs)(({ theme }) => ({
  color: theme.colors.secondary,
}))
