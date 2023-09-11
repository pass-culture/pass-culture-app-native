import { useNavigation } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { AuthenticationButton } from 'features/auth/components/AuthenticationButton/AuthenticationButton'
import { useAuthContext } from 'features/auth/context/AuthContext'
import {
  TutorialRootStackParamList,
  UseNavigationType,
} from 'features/navigation/RootNavigator/types'
import { useDepositActivationAge } from 'features/profile/helpers/useDepositActivationAge'
import { TutorialTimelineSixteen } from 'features/tutorial/components/profileTutorial/TutorialTimelineSixteen'
import { TutorialTimelineFifteen } from 'features/tutorial/components/TutorialTimelineFifteen'
import { env } from 'libs/environment'
import { getAge } from 'shared/user/getAge'
import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'
import { ButtonQuaternarySecondary } from 'ui/components/buttons/ButtonQuarternarySecondary'
import { ButtonWithLinearGradient } from 'ui/components/buttons/buttonWithLinearGradient/ButtonWithLinearGradient'
import { AnimatedBlurHeaderTitle } from 'ui/components/headers/AnimatedBlurHeader'
import { useGetHeaderHeight } from 'ui/components/headers/PageHeaderWithoutPlaceholder'
import { InfoBanner } from 'ui/components/InfoBanner'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { Spacer, Typo, getSpacing } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type Props = StackScreenProps<TutorialRootStackParamList, 'ProfileTutorialAgeInformation'>

export const ProfileTutorialAgeInformation: FunctionComponent<Props> = ({ route }: Props) => {
  const { isLoggedIn, user } = useAuthContext()
  const { goBack } = useNavigation<UseNavigationType>()
  const { onScroll, headerTransition } = useOpacityTransition()
  const headerHeight = useGetHeaderHeight()

  const defaultAge = route.params.selectedAge ?? 15
  const age = isLoggedIn && user?.birthDate ? getAge(user.birthDate) : defaultAge

  const activationAge = useDepositActivationAge()

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
        <InfoBanner message="Cette page a-t-elle été utile&nbsp;? Aide-nous à l’améliorer en répondant à notre questionnaire.">
          <Spacer.Column numberOfSpaces={2} />
          <ExternalTouchableLink
            as={ButtonQuaternarySecondary}
            justifyContent="flex-start"
            icon={ExternalSiteFilled}
            wording="Donner mon avis"
            externalNav={{ url: env.TUTORIAL_FEEDBACK_LINK }}
            inline
          />
        </InfoBanner>
        {!isLoggedIn ? (
          <Container>
            <Spacer.Column numberOfSpaces={4} />
            <InternalTouchableLink
              as={ButtonWithLinearGradient}
              wording="Créer un compte"
              navigateTo={{ screen: 'SignupForm', params: { preventCancellation: true } }}
            />
            <Spacer.Column numberOfSpaces={4} />
            <StyledLoginButton />
          </Container>
        ) : null}
      </StyledScrollView>
      <AnimatedBlurHeaderTitle
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
