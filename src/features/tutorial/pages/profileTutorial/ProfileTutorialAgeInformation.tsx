import { useNavigation } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { SubscriptionStatus, YoungStatusType } from 'api/gen'
import { AuthenticationButton } from 'features/auth/components/AuthenticationButton/AuthenticationButton'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { PreValidationSignupStep } from 'features/auth/enums'
import {
  StepperOrigin,
  TutorialRootStackParamList,
  UseNavigationType,
} from 'features/navigation/RootNavigator/types'
import { useDepositActivationAge } from 'features/profile/helpers/useDepositActivationAge'
import { EligibleFooter } from 'features/tutorial/components/profileTutorial/EligibleFooter'
import { TutorialTimelineEighteen } from 'features/tutorial/components/profileTutorial/Timelines/TutorialTimelineEighteen'
import { TutorialTimelineFifteen } from 'features/tutorial/components/profileTutorial/Timelines/TutorialTimelineFifteen'
import { TutorialTimelineSeventeen } from 'features/tutorial/components/profileTutorial/Timelines/TutorialTimelineSeventeen'
import { TutorialTimelineSixteen } from 'features/tutorial/components/profileTutorial/Timelines/TutorialTimelineSixteen'
import { analytics } from 'libs/analytics/provider'
import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'
import { ButtonWithLinearGradient } from 'ui/components/buttons/buttonWithLinearGradient/ButtonWithLinearGradient'
import { ContentHeader } from 'ui/components/headers/ContentHeader'
import { useGetHeaderHeight } from 'ui/components/headers/PageHeaderWithoutPlaceholder'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { Spacer, Typo, getSpacing } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type Props = StackScreenProps<TutorialRootStackParamList, 'ProfileTutorialAgeInformation'>

const onLoginPress = () => analytics.logLoginClicked({ from: 'Tutorial' })
const onSignupPress = () =>
  analytics.logStepperDisplayed(StepperOrigin.TUTORIAL, PreValidationSignupStep.Email)

export const ProfileTutorialAgeInformation: FunctionComponent<Props> = ({ route }: Props) => {
  const { isLoggedIn, user } = useAuthContext()
  const { goBack } = useNavigation<UseNavigationType>()
  const { onScroll, headerTransition } = useOpacityTransition()
  const headerHeight = useGetHeaderHeight()

  const age = route.params.age

  const activationAge = useDepositActivationAge()

  const isEligible = isLoggedIn && user?.status?.statusType === YoungStatusType.eligible
  const isEligibleWithoutSubscription =
    isEligible &&
    user?.status?.subscriptionStatus === SubscriptionStatus.has_to_complete_subscription

  const headerTitle = isLoggedIn ? 'Comment ça marche\u00a0?' : `Le pass Culture à ${age} ans`

  return (
    <React.Fragment>
      <StyledScrollView onScroll={onScroll} scrollEventThrottle={16}>
        <Placeholder height={headerHeight} />
        <Spacer.Column numberOfSpaces={7} />
        <Typo.Title3 numberOfLines={3} {...getHeadingAttrs(1)}>
          {headerTitle}
        </Typo.Title3>
        <Spacer.Column numberOfSpaces={6} />
        <Timeline age={age} activationAge={activationAge} />
        <Spacer.Column numberOfSpaces={4} />
        {isLoggedIn ? null : (
          <Container>
            <Spacer.Column numberOfSpaces={10} />
            <StyledBody>Identifie-toi pour bénéficier de ton crédit pass Culture</StyledBody>
            <Spacer.Column numberOfSpaces={4} />
            <InternalTouchableLink
              as={ButtonWithLinearGradient}
              wording="Créer un compte"
              navigateTo={{
                screen: 'SignupForm',
                params: { from: StepperOrigin.TUTORIAL },
              }}
              onBeforeNavigate={onSignupPress}
            />
            <Spacer.Column numberOfSpaces={4} />
            <StyledLoginButton onAdditionalPress={onLoginPress} />
          </Container>
        )}
        {isEligibleWithoutSubscription && age ? (
          <React.Fragment>
            <Spacer.Column numberOfSpaces={10} />
            <EligibleFooter age={age} />
          </React.Fragment>
        ) : null}
        <Spacer.Column numberOfSpaces={8} />
      </StyledScrollView>
      <ContentHeader
        headerTitle={headerTitle}
        headerTransition={headerTransition}
        onBackPress={goBack}
      />
    </React.Fragment>
  )
}

const Timeline = ({
  age,
  activationAge,
}: {
  age: number | undefined
  activationAge?: number | null
}) => {
  switch (age) {
    case 15:
      return <TutorialTimelineFifteen />
    case 16:
      return <TutorialTimelineSixteen activatedAt={activationAge} />
    case 17:
      return <TutorialTimelineSeventeen activatedAt={activationAge} />
    case 18:
      return <TutorialTimelineEighteen activatedAt={activationAge} />
    default:
      return null
  }
}

const StyledScrollView = styled.ScrollView.attrs(({ theme }) => ({
  contentContainerStyle: {
    paddingHorizontal: getSpacing(6),
    maxWidth: theme.contentPage.maxWidth,
    width: '100%',
    alignSelf: 'center',
  },
}))``

const StyledLoginButton = styled(AuthenticationButton).attrs(({ theme }) => ({
  type: 'login',
  linkColor: theme.colors.secondary,
}))``

const Container = styled.View({
  flexDirection: 'column',
})

const Placeholder = styled.View<{ height: number }>(({ height }) => ({
  height,
}))

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})
