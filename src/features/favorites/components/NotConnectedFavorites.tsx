import React from 'react'
import styled from 'styled-components/native'

import { AuthenticationButton } from 'features/auth/components/AuthenticationButton/AuthenticationButton'
import { StepperOrigin } from 'features/navigation/navigators/RootNavigator/types'
import { analytics } from 'libs/analytics/provider'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { remoteIllustrationUrls } from 'shared/illustrations/remoteIllustrations'
import { RemoteIllustration } from 'ui/components/RemoteIllustration'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Button } from 'ui/designSystem/Button/Button'
import { UserFavorite } from 'ui/svg/icons/UserFavorite'
import { Spacer, Typo } from 'ui/theme'

export const NotConnectedFavorites = () => {
  const enableNewVisionUi = useFeatureFlag(RemoteStoreFeatureFlags.WIP_NEW_VISION_UI)

  const onBeforeSignupNavigate = () => {
    void analytics.logSignUpFromFavorite()
    void analytics.logSignUpClicked({ from: 'favorite' })
  }

  const onBeforeLoginNavigate = () => {
    void analytics.logSignInFromFavorite()
  }

  return (
    <Wrapper>
      <ScrollContainer showsVerticalScrollIndicator={false}>
        <MainContent gap={6}>
          <IllustrationContainer>
            {enableNewVisionUi ? (
              <RemoteIllustration
                url={remoteIllustrationUrls.girlHoldingHeartMosaicLarge}
                backgroundColor="positive01"
                testID="remote-illustration"
              />
            ) : (
              <Illustration />
            )}
          </IllustrationContainer>
          <TextContainer gap={6}>
            <StyledTitle2>Identifie-toi pour retrouver tes favoris</StyledTitle2>
            <StyledBody>
              Ton compte te permettra de retrouver tous tes bons plans en un clin d’oeil&nbsp;!
            </StyledBody>
          </TextContainer>
          <ButtonContainer gap={3}>
            <InternalTouchableLink
              key={1}
              as={Button}
              wording="Créer un compte"
              navigateTo={{ screen: 'SignupMethods', params: { from: StepperOrigin.FAVORITE } }}
              onBeforeNavigate={onBeforeSignupNavigate}
              fullWidth
            />
            <StyledAuthenticationButton
              key={2}
              type="login"
              onAdditionalPress={onBeforeLoginNavigate}
              params={{ from: StepperOrigin.FAVORITE }}
            />
          </ButtonContainer>
        </MainContent>
        <Spacer.TabBar />
      </ScrollContainer>
    </Wrapper>
  )
}

const Wrapper = styled.View({
  flex: 1,
  overflow: 'hidden',
})

const ScrollContainer = styled.ScrollView.attrs(({ theme }) => ({
  contentContainerStyle: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: theme.designSystem.size.spacing.xl,
    paddingHorizontal: theme.contentPage.marginHorizontal,
    paddingBottom: theme.designSystem.size.spacing.xl,
  },
}))``

const MainContent = styled(ViewGap)({
  width: '100%',
  alignItems: 'center',
})

const IllustrationContainer = styled.View({
  alignItems: 'center',
  justifyContent: 'center',
})

const Illustration = styled(UserFavorite).attrs(({ theme }) => ({
  size: theme.illustrations.sizes.fullPage,
  color: theme.designSystem.color.icon.brandPrimary,
}))``

const ButtonContainer = styled(ViewGap)(({ theme }) => ({
  maxWidth: theme.contentPage.maxWidth,
  width: '100%',
  alignContent: 'center',
}))

const StyledAuthenticationButton = styled(AuthenticationButton).attrs(({ theme }) => ({
  linkColor: theme.designSystem.color.text.brandSecondary,
}))``

const TextContainer = styled(ViewGap)({
  alignItems: 'center',
})

const StyledTitle2 = styled(Typo.Title2)({
  textAlign: 'center',
})

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})
