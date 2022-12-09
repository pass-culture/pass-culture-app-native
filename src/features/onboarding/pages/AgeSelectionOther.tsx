import React, { FunctionComponent, useCallback } from 'react'
import styled from 'styled-components/native'

import { navigateToHomeConfig } from 'features/navigation/helpers'
import { AgeButton } from 'features/onboarding/components/AgeButton'
import { useOnboardingContext } from 'features/onboarding/context/OnboardingWrapper'
import { OnboardingPage } from 'features/onboarding/pages/OnboardingPage'
import { NonEligible } from 'features/onboarding/types'
import { env } from 'libs/environment/env'
import { analytics } from 'libs/firebase/analytics'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { InfoPlain } from 'ui/svg/icons/InfoPlain'
import { Spacer, Typo } from 'ui/theme'
import { getNoHeadingAttrs } from 'ui/theme/typographyAttrs/getNoHeadingAttrs'

export const AgeSelectionOther: FunctionComponent = () => {
  const { showNonEligibleModal } = useOnboardingContext()

  const logGoToParentsFAQ = useCallback(() => analytics.logGoToParentsFAQ('ageselectionother'), [])
  const onUnder15Press = useCallback(() => {
    analytics.logSelectAge(NonEligible.UNDER_15)
    showNonEligibleModal(NonEligible.UNDER_15)
  }, [showNonEligibleModal])
  const onOver18Press = useCallback(() => {
    analytics.logSelectAge(NonEligible.OVER_18)
    showNonEligibleModal(NonEligible.OVER_18)
  }, [showNonEligibleModal])

  return (
    <OnboardingPage>
      <AgeButton
        onBeforeNavigate={onUnder15Press}
        navigateTo={navigateToHomeConfig}
        accessibilityLabel="j’ai moins de 15 ans">
        <Title4Text>
          j’ai <Title3Text>moins de 15 ans</Title3Text>
        </Title4Text>
      </AgeButton>
      <Spacer.Column numberOfSpaces={4} />
      <AgeButton
        onBeforeNavigate={onOver18Press}
        navigateTo={navigateToHomeConfig}
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
        externalNav={{ url: env.FAQ_LINK_LEGAL_GUARDIAN }}
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
