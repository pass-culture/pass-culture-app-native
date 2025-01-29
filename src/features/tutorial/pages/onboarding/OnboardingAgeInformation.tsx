import { useNavigation } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'

import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import {
  StepperOrigin,
  TutorialRootStackParamList,
  UseNavigationType,
} from 'features/navigation/RootNavigator/types'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { OnboardingTimeline } from 'features/tutorial/components/onboarding/OnboardingTimeline'
import { TutorialTypes } from 'features/tutorial/enums'
import { TutorialPage } from 'features/tutorial/pages/TutorialPage'
import { analytics } from 'libs/analytics/provider'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { ButtonWithLinearGradient } from 'ui/components/buttons/buttonWithLinearGradient/ButtonWithLinearGradient'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { ClockFilled } from 'ui/svg/icons/ClockFilled'
import { Spacer, TypoDS } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type Props = StackScreenProps<TutorialRootStackParamList, 'OnboardingAgeInformation'>

const onSignupPress = () => {
  analytics.logOnboardingAgeInformationClicked({ type: 'account_creation' })
  analytics.logSignUpClicked({ from: TutorialTypes.ONBOARDING })
}

export const OnboardingAgeInformation = ({ route }: Props): React.JSX.Element => {
  const { reset } = useNavigation<UseNavigationType>()
  const userAge = route.params.age

  const onLaterPress = () => {
    analytics.logOnboardingAgeInformationClicked({ type: 'account_creation_skipped' })
    reset({ index: 0, routes: [{ name: homeNavConfig[0] }] })
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
      <TypoDS.Title4 {...getHeadingAttrs(2)}>Comment ça marche&nbsp;?</TypoDS.Title4>
      <Spacer.Column numberOfSpaces={2} />
      <OnboardingTimeline age={userAge} />
    </TutorialPage>
  )
}
