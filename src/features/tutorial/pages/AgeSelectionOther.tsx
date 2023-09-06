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
import { AgeButton } from 'features/tutorial/components/AgeButton'
import { useOnboardingContext } from 'features/tutorial/context/OnboardingWrapper'
import { TutorialPage } from 'features/tutorial/pages/TutorialPage'
import { NonEligible } from 'features/tutorial/types'
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
    analytics.logSelectAge(NonEligible.UNDER_15)
    showNonEligibleModal(NonEligible.UNDER_15)
    reset({ index: 0, routes: [{ name: homeNavConfig[0] }] })
    await storage.saveObject('user_age', NonEligible.UNDER_15)
  }, [showNonEligibleModal, reset])

  const onOver18Press = useCallback(async () => {
    analytics.logSelectAge(NonEligible.OVER_18)
    showNonEligibleModal(NonEligible.OVER_18)
    reset({ index: 0, routes: [{ name: homeNavConfig[0] }] })
    await storage.saveObject('user_age', NonEligible.OVER_18)
  }, [showNonEligibleModal, reset])

  const title = type === 'onboarding' ? 'Quel âge as-tu\u00a0?' : 'Comment ça marche\u00a0?'
  const startButtonTitle = type === 'onboarding' ? 'j’ai' : 'à'

  return (
    <TutorialPage title={title}>
      <AgeButton
        onBeforeNavigate={onUnder15Press}
        navigateTo={navigateToHomeConfig}
        // We disable navigation because we reset the navigation before,
        // but we still want to use a link (not just a button) for accessibility reason
        enableNavigate={false}
        accessibilityLabel={`${startButtonTitle} moins de 15 ans`}>
        <Title4Text>
          {startButtonTitle}
          <Title3Text> moins de 15 ans</Title3Text>
        </Title4Text>
      </AgeButton>
      <Spacer.Column numberOfSpaces={4} />
      <AgeButton
        onBeforeNavigate={onOver18Press}
        navigateTo={navigateToHomeConfig}
        // We disable navigation because we reset the navigation before,
        // but we still want to use a link (not just a button) for accessibility reason
        enableNavigate={false}
        accessibilityLabel={`${startButtonTitle} plus de 18 ans`}>
        <Title4Text>
          {startButtonTitle}
          <Title3Text> plus de 18 ans</Title3Text>
        </Title4Text>
      </AgeButton>
    </TutorialPage>
  )
}

const Title3Text = styled(Typo.Title3).attrs(getNoHeadingAttrs)(({ theme }) => ({
  color: theme.colors.secondary,
}))

const Title4Text = styled(Typo.Title4).attrs(getNoHeadingAttrs)(({ theme }) => ({
  color: theme.colors.secondary,
}))
