import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React from 'react'

import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { useNavigateToHomeWithReset } from 'features/navigation/helpers/useNavigateToHomeWithReset'
import { OnboardingStackParamList } from 'features/navigation/OnboardingStackNavigator/OnboardingStackTypes'
import { StepperOrigin } from 'features/navigation/RootNavigator/types'
import { OnboardingTimeline } from 'features/onboarding/components/OnboardingTimeline'
import { TutorialPage } from 'features/profile/pages/Tutorial/TutorialPage'
import { analytics } from 'libs/analytics/provider'
import { eventMonitoring } from 'libs/monitoring/services'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Button } from 'ui/designSystem/Button/Button'
import { ClockFilled } from 'ui/svg/icons/ClockFilled'
import { Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type Props = NativeStackScreenProps<OnboardingStackParamList, 'OnboardingAgeInformation'>

const onSignupPress = () => {
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
    navigateToHomeWithReset()
  }

  const buttons = [
    <InternalTouchableLink
      as={Button}
      key={1}
      fullWidth
      variant="primary"
      wording="Créer un compte"
      onBeforeNavigate={onSignupPress}
      navigateTo={{
        screen: 'SignupForm',
        params: { from: StepperOrigin.TUTORIAL },
      }}
    />,
    <InternalTouchableLink
      as={Button}
      key={2}
      fullWidth
      variant="tertiary"
      color="neutral"
      wording="Plus tard"
      icon={ClockFilled}
      onBeforeNavigate={onLaterPress}
      navigateTo={navigateToHomeConfig}
      // We disable navigation because we reset the navigation before,
      // but we still want to use a link (not just a button) for accessibility reason
      enableNavigate={false}
    />,
  ]

  return (
    <TutorialPage title={`À ${userAge} ans, profite de ton pass Culture\u00a0!`} buttons={buttons}>
      <ViewGap gap={2}>
        <Typo.Title4 {...getHeadingAttrs(2)}>Comment ça marche&nbsp;?</Typo.Title4>
        <OnboardingTimeline age={userAge} />
      </ViewGap>
    </TutorialPage>
  )
}
