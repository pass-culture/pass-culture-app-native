import { useNavigation } from '@react-navigation/native'
import React, { FunctionComponent, useCallback } from 'react'
import styled from 'styled-components/native'

import { navigateToHomeConfig } from 'features/navigation/helpers'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { AgeButton } from 'features/onboarding/components/AgeButton'
import { useOnboardingContext } from 'features/onboarding/context/OnboardingWrapper'
import { OnboardingPage } from 'features/onboarding/pages/OnboardingPage'
import { NonEligible } from 'features/onboarding/types'
import { env } from 'libs/environment/env'
import { analytics } from 'libs/firebase/analytics'
import { storage } from 'libs/storage'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { InfoPlain } from 'ui/svg/icons/InfoPlain'
import { Spacer, Typo } from 'ui/theme'
import { getNoHeadingAttrs } from 'ui/theme/typographyAttrs/getNoHeadingAttrs'

const externalUrl = { url: env.FAQ_LINK_LEGAL_GUARDIAN }
const logGoToParentsFAQ = () => analytics.logGoToParentsFAQ('ageselectionother')

export const AgeSelectionOther: FunctionComponent = () => {
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

  return (
    <OnboardingPage>
      <AgeButton
        onBeforeNavigate={onUnder15Press}
        navigateTo={navigateToHomeConfig}
        // We disable navigation because we reset the navigation before,
        // but we still want to use a link (not just a button) for accessibility reason
        enableNavigate={false}
        accessibilityLabel="j’ai moins de 15 ans">
        <Title4Text>
          j’ai <Title3Text>moins de 15 ans</Title3Text>
        </Title4Text>
      </AgeButton>
      <Spacer.Column numberOfSpaces={4} />
      <AgeButton
        onBeforeNavigate={onOver18Press}
        navigateTo={navigateToHomeConfig}
        // We disable navigation because we reset the navigation before,
        // but we still want to use a link (not just a button) for accessibility reason
        enableNavigate={false}
        accessibilityLabel="j’ai plus de 18 ans">
        <Title4Text>
          j’ai <Title3Text>plus de 18 ans</Title3Text>
        </Title4Text>
      </AgeButton>
      <Spacer.Column numberOfSpaces={4} />
      <ExternalTouchableLink
        key={1}
        as={ButtonTertiaryBlack}
        wording="Je suis un parent"
        icon={InfoPlain}
        onBeforeNavigate={logGoToParentsFAQ}
        externalNav={externalUrl}
      />
    </OnboardingPage>
  )
}

const Title3Text = styled(Typo.Title3).attrs(getNoHeadingAttrs)(({ theme }) => ({
  color: theme.colors.secondary,
}))

const Title4Text = styled(Typo.Title4).attrs(getNoHeadingAttrs)(({ theme }) => ({
  color: theme.colors.secondary,
}))
