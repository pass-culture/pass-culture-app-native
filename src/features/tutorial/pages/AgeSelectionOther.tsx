import { useNavigation } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import React, { FunctionComponent, useCallback } from 'react'
import styled from 'styled-components/native'

import { navigateToHomeConfig } from 'features/navigation/helpers'
import {
  UseNavigationType,
  TutorialRootStackParamList,
} from 'features/navigation/RootNavigator/types'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { AgeButtonOther } from 'features/tutorial/components/AgeButtonOther'
import { useOnboardingContext } from 'features/tutorial/context/OnboardingWrapper'
import { NonEligible, Tutorial } from 'features/tutorial/enums'
import { TutorialPage } from 'features/tutorial/pages/TutorialPage'
import { analytics } from 'libs/analytics'
import { storage } from 'libs/storage'
import { Spacer, Typo } from 'ui/theme'
import { getNoHeadingAttrs } from 'ui/theme/typographyAttrs/getNoHeadingAttrs'

type Props = StackScreenProps<TutorialRootStackParamList, 'AgeSelection'>

export const AgeSelectionOther: FunctionComponent<Props> = ({ route }: Props) => {
  const type = route.params.type

  const { showNonEligibleModal } = useOnboardingContext()
  const { reset } = useNavigation<UseNavigationType>()

  const onUnder15Press = useCallback(async () => {
    analytics.logSelectAge({ age: NonEligible.UNDER_15, from: type })
    showNonEligibleModal(NonEligible.UNDER_15, type)

    if (type === Tutorial.ONBOARDING) {
      reset({ index: 0, routes: [{ name: homeNavConfig[0] }] })
      await storage.saveObject('user_age', NonEligible.UNDER_15)
    }
  }, [type, showNonEligibleModal, reset])

  const onOver18Press = useCallback(async () => {
    analytics.logSelectAge({ age: NonEligible.OVER_18, from: type })
    showNonEligibleModal(NonEligible.OVER_18, type)

    if (type === Tutorial.ONBOARDING) {
      reset({ index: 0, routes: [{ name: homeNavConfig[0] }] })
      await storage.saveObject('user_age', NonEligible.OVER_18)
    }
  }, [type, showNonEligibleModal, reset])

  const title = type === Tutorial.ONBOARDING ? 'Quel âge as-tu\u00a0?' : 'Comment ça marche\u00a0?'
  const startButtonTitle = type === Tutorial.ONBOARDING ? 'j’ai' : 'à'

  return (
    <TutorialPage title={title}>
      <AgeButtonOther
        type={type}
        onPress={onUnder15Press}
        navigateTo={navigateToHomeConfig}
        // We disable navigation because we reset the navigation before,
        // but we still want to use a link (not just a button) for accessibility reason
        enableNavigate={false}
        accessibilityLabel={`${startButtonTitle} moins de 15 ans`}>
        <Title4Text>
          {startButtonTitle}
          <Title3Text> moins de 15 ans</Title3Text>
        </Title4Text>
      </AgeButtonOther>
      <Spacer.Column numberOfSpaces={4} />
      <AgeButtonOther
        type={type}
        onPress={onOver18Press}
        navigateTo={navigateToHomeConfig}
        // We disable navigation because we reset the navigation before,
        // but we still want to use a link (not just a button) for accessibility reason
        enableNavigate={false}
        accessibilityLabel={`${startButtonTitle} plus de 18 ans`}>
        <Title4Text>
          {startButtonTitle}
          <Title3Text> plus de 18 ans</Title3Text>
        </Title4Text>
      </AgeButtonOther>
    </TutorialPage>
  )
}

const Title3Text = styled(Typo.Title3).attrs(getNoHeadingAttrs)(({ theme }) => ({
  color: theme.colors.secondary,
}))

const Title4Text = styled(Typo.Title4).attrs(getNoHeadingAttrs)(({ theme }) => ({
  color: theme.colors.secondary,
}))
