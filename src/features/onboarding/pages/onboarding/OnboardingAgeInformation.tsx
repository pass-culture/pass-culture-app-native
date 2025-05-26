import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'

import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { useNavigateToHomeWithReset } from 'features/navigation/helpers/useNavigateToHomeWithReset'
import { OnboardingStackParamList } from 'features/navigation/OnboardingStackNavigator/OnboardingStackTypes'
import { StepperOrigin } from 'features/navigation/RootNavigator/types'
import { OnboardingTimeline } from 'features/onboarding/components/OnboardingTimeline'
import { TutorialPage } from 'features/profile/pages/Tutorial/TutorialPage'
import { analytics } from 'libs/analytics/provider'
import { eventMonitoring } from 'libs/monitoring/services'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { ButtonWithLinearGradient } from 'ui/components/buttons/buttonWithLinearGradient/ButtonWithLinearGradient'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { ClockFilled } from 'ui/svg/icons/ClockFilled'
import { Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type Props = StackScreenProps<OnboardingStackParamList, 'OnboardingAgeInformation'>

const onSignupPress = () => {
  analytics.logOnboardingAgeInformationClicked({ type: 'account_creation' })
  analytics.logSignUpClicked({ from: 'onboarding' })
}

export const OnboardingAgeInformation = ({ route }: Props): React.JSX.Element | null => {
  const { navigateToHomeWithReset } = useNavigateToHomeWithReset()

  const userAge = route?.params?.age

  if (!userAge) {
    eventMonitoring.captureException('route.params.type is falsy')
    navigateToHomeWithReset()
    return null
  }

  const onLaterPress = () => {
    analytics.logOnboardingAgeInformationClicked({ type: 'account_creation_skipped' })
    navigateToHomeWithReset()
  }

  const buttons = [
    <InternalTouchableLink
      key={1}
      as={ButtonWithLinearGradient}
      wording="Créer un compte"
      onBeforeNavigate={onSignupPress}
      navigateTo={{
        screen: 'SignupForm',
        params: { from: StepperOrigin.TUTORIAL },
      }}
    />,
    <InternalTouchableLink
      key={2}
      as={ButtonTertiaryBlack}
      wording="Plus tard"
      icon={ClockFilled}
      onBeforeNavigate={onLaterPress}
      navigateTo={navigateToHomeConfig}
      // We disable navigation because we reset the navigation before,
      // but we still want to use a link (not just a button) for accessibility reason
      enableNavigate={false}
      fullWidth
    />,
  ]

  return (
    <TutorialPage title={`À ${userAge} ans, profite de ton pass Culture\u00a0!`} buttons={buttons}>
      <Typo.Title4 {...getHeadingAttrs(2)}>Comment ça marche&nbsp;?</Typo.Title4>
      <Spacer.Column numberOfSpaces={2} />
      <OnboardingTimeline age={userAge} />
    </TutorialPage>
  )
}
