import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled from 'styled-components/native'

import { AuthenticationButton } from 'features/auth/components/AuthenticationButton/AuthenticationButton'
import { analytics } from 'libs/analytics/provider'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Page } from 'ui/pages/Page'
import { RoundedCardWithPicture } from 'ui/pages/RoundedCardPicture'
import { UserFavorite } from 'ui/svg/icons/UserFavorite'
import { Spacer, Typo } from 'ui/theme'

export const NotConnectedFavorites = () => {
  const { bottom } = useSafeAreaInsets()

  const onBeforeSignupNavigate = () => {
    analytics.logSignUpFromFavorite()
    analytics.logSignUpClicked({ from: 'favorite' })
  }

  return (
    <Page>
      <Spacer.TabBar />
      <RoundedCardWithPicture />
      <Spacer.TabBar />
    </Page>
  )
}

const ScrollContainer = styled.ScrollView.attrs<{ bottom: number }>(({ bottom }) => ({
  contentContainerStyle: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: bottom,
  },
}))<{ bottom: number }>(({ theme }) => ({
  paddingHorizontal: theme.contentPage.marginHorizontal,
  paddingVertical: theme.contentPage.marginVertical,
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
