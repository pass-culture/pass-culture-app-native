import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled from 'styled-components/native'

import { AuthenticationButton } from 'features/auth/components/AuthenticationButton/AuthenticationButton'
import { StepperOrigin } from 'features/navigation/RootNavigator/types'
import { analytics } from 'libs/analytics/provider'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Page } from 'ui/pages/Page'
import { UserFavorite } from 'ui/svg/icons/UserFavorite'
import { Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

export const NotConnectedFavorites = () => {
  const { bottom } = useSafeAreaInsets()

  const onBeforeSignupNavigate = () => {
    void analytics.logSignUpFromFavorite()
    void analytics.logSignUpClicked({ from: 'favorite' })
  }

  return (
    <Container bottom={bottom}>
      <IllustrationContainer>
        <Illustration />
      </IllustrationContainer>
      <TextContainer gap={4}>
        <StyledTitle2 {...getHeadingAttrs(1)}>
          Identifie-toi pour retrouver tes favoris
        </StyledTitle2>
        <StyledBody {...getHeadingAttrs(2)}>
          Ton compte te permettra de retrouver tous tes bons plans en un clin d’oeil&nbsp;!
        </StyledBody>
      </TextContainer>
      <ButtonContainer gap={4}>
        <InternalTouchableLink
          key={1}
          as={ButtonPrimary}
          wording="Créer un compte"
          navigateTo={{ screen: 'SignupForm', params: { from: StepperOrigin.FAVORITE } }}
          onBeforeNavigate={onBeforeSignupNavigate}
        />
        <StyledAuthenticationButton
          key={2}
          type="login"
          onAdditionalPress={() => void analytics.logSignInFromFavorite()}
          params={{ from: StepperOrigin.FAVORITE }}
        />
      </ButtonContainer>
    </Container>
  )
}

const Container = styled(Page)<{ bottom: number }>(({ theme, bottom }) => ({
  flex: 1,
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingHorizontal: theme.contentPage.marginHorizontal,
  paddingVertical: theme.contentPage.marginVertical,
  paddingBottom: bottom,
  display: 'flex',
}))

const IllustrationContainer = styled.View(({ theme }) => ({
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.designSystem.size.spacing.xl,
}))

const Illustration = styled(UserFavorite).attrs(({ theme }) => ({
  size: theme.illustrations.sizes.fullPage,
  color: theme.designSystem.color.icon.brandPrimary,
}))``

const ButtonContainer = styled(ViewGap)(({ theme }) => ({
  maxWidth: theme.contentPage.maxWidth,
  width: '100%',
}))

const StyledAuthenticationButton = styled(AuthenticationButton).attrs(({ theme }) => ({
  linkColor: theme.designSystem.color.text.brandSecondary,
}))``

const TextContainer = styled(ViewGap)(({ theme }) => ({
  alignItems: 'center',
  marginBottom: theme.designSystem.size.spacing.xxxxl,
}))

const StyledTitle2 = styled(Typo.Title2)({
  textAlign: 'center',
})

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})
