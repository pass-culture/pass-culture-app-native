import { useNavigation } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { AuthenticationButton } from 'features/auth/components/AuthenticationButton/AuthenticationButton'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { useDepositActivationAge } from 'features/profile/helpers/useDepositActivationAge'
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

interface Props {
  selectedAge?: 15 | 16 | 17 | 18
}

export const AgeInformationTutorial: FunctionComponent<Props> = ({ selectedAge }) => {
  const { isLoggedIn, user } = useAuthContext()
  const { goBack } = useNavigation<UseNavigationType>()
  const { onScroll, headerTransition } = useOpacityTransition()
  const headerHeight = useGetHeaderHeight()

  const defaultAge = selectedAge ?? 15
  const age = user?.birthDate ? getAge(user.birthDate) : defaultAge

  const activationAge = useDepositActivationAge()
  const activationText = activationAge
    ? `Crédit activé à ${activationAge} ans`
    : 'Crédit pas encore activé'

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
        {/* À supprimer lors de la vraie implémentation*/}
        <Typo.Body>{activationText}</Typo.Body>
        <Spacer.Column numberOfSpaces={4} />
        <InfoBanner message="Cette page a-t-elle été utile&nbsp;? Aide-nous à l’améliorer en répondant à notre questionnaire.">
          <ExternalTouchableLink
            as={ButtonQuaternarySecondary}
            justifyContent="flex-start"
            icon={ExternalSiteFilled}
            wording="Donner mon avis"
            externalNav={{ url: 'https://passculture.qualtrics.com/jfe/form/SV_8rkHZvOvmtdq4V8' }}
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
        <Placeholder height={2000} />
      </StyledScrollView>
      <AnimatedBlurHeaderTitle
        headerTitle={headerTitle}
        headerTransition={headerTransition}
        onBackPress={goBack}
      />
    </React.Fragment>
  )
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
