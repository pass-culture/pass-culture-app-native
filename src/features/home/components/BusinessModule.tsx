import { t } from '@lingui/macro'
import React, { useEffect, useState } from 'react'
import { PixelRatio } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { useAuthContext } from 'features/auth/AuthContext'
import { useUserProfileInfo } from 'features/home/api'
import { NextArrowIcon } from 'features/home/assets/NextArrowIcon'
import { BusinessPane } from 'features/home/contentful'
import { openUrl } from 'features/navigation/helpers'
import { analytics } from 'libs/analytics'
import { useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { Idea } from 'ui/svg/icons/Idea'
import { Typo, getSpacing, MARGIN_DP, LENGTH_XS, RATIO_BUSINESS, Spacer } from 'ui/theme'
import { customFocusOutline } from 'ui/theme/customFocusOutline'

import { fillUrlEmail, shouldUrlBeFilled, showBusinessModule } from './BusinessModule.utils'

export const BusinessModule = ({ module }: { module: BusinessPane }) => {
  const [isFocus, setIsFocus] = useState(false)
  const { title, firstLine, secondLine, leftIcon, image, url } = module
  const isDisabled = !url
  const { appContentWidth } = useTheme()
  const { isLoggedIn } = useAuthContext()
  const imageWidth = appContentWidth - 2 * MARGIN_DP
  const imageHeight = PixelRatio.roundToNearestPixel(imageWidth * RATIO_BUSINESS)

  const [shouldRedirect, setShouldRedirect] = useState(false)

  const { data: user, isLoading: isUserLoading } = useUserProfileInfo()
  const { showInfoSnackBar } = useSnackBarContext()

  const logAndOpenUrl = (finalUrl: string) => {
    setShouldRedirect(false)
    analytics.logClickBusinessBlock(title)
    openUrl(finalUrl)
  }

  useEffect(() => {
    if (!url || !shouldRedirect) return
    if (!shouldUrlBeFilled(url)) {
      logAndOpenUrl(url)
      return
    }
    if (user) {
      logAndOpenUrl(fillUrlEmail(url, user.email))
      return
    }
    if (isUserLoading) {
      showInfoSnackBar({ message: t`Redirection en cours` })
      return
    }
  }, [url, user, shouldRedirect])

  const shouldModuleBeDisplayed = showBusinessModule(module.targetNotConnectedUsersOnly, isLoggedIn)
  if (!shouldModuleBeDisplayed) return <React.Fragment />
  return (
    <Row>
      <Spacer.Row numberOfSpaces={6} />
      <TouchableHighlight
        onPress={() => setShouldRedirect(true)}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        isFocus={isFocus}
        disabled={isDisabled}>
        <ImageContainer>
          <ImageBackground
            source={{ uri: image }}
            height={imageHeight}
            width={imageWidth}
            testID="imageBusiness">
            <Container>
              <IconContainer>
                {leftIcon ? <Image source={{ uri: leftIcon }} /> : <IdeaIcon />}
              </IconContainer>
              <TextContainer>
                <ButtonText testID="firstLine">{firstLine}</ButtonText>
                <StyledBody numberOfLines={2}>{secondLine}</StyledBody>
              </TextContainer>
              {!isDisabled && (
                <IconContainer>
                  <NextArrowIcon />
                </IconContainer>
              )}
            </Container>
          </ImageBackground>
        </ImageContainer>
      </TouchableHighlight>
      <Spacer.Row numberOfSpaces={6} />
    </Row>
  )
}

const Row = styled.View({
  flexDirection: 'row',
  paddingBottom: getSpacing(6),
})

const TouchableHighlight = styled.TouchableHighlight<{ isFocus?: boolean }>(
  ({ theme, isFocus }) => ({
    borderRadius: theme.borderRadius.radius,
    ...customFocusOutline(theme, isFocus),
  })
)

const ImageContainer = styled.View(({ theme }) => ({
  borderRadius: theme.borderRadius.radius,
  overflow: 'hidden',
  maxHeight: LENGTH_XS,
}))

const Image = styled.Image(({ theme }) => ({
  width: getSpacing(14),
  height: getSpacing(14),
  tintColor: theme.colors.white,
}))

const ImageBackground = styled.ImageBackground<{ width: number; height: number }>((props) => ({
  height: props.height,
  width: props.width,
  justifyContent: 'center',
  maxHeight: LENGTH_XS,
  backgroundColor: props.theme.colors.primary,
}))

const Container = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: getSpacing(2),
  paddingHorizontal: getSpacing(1.5),
})

const TextContainer = styled.View({
  flex: 1,
  flexDirection: 'column',
  paddingVertical: getSpacing(1),
  paddingHorizontal: getSpacing(0.5),
})

const IconContainer = styled.View({
  width: getSpacing(14),
  height: getSpacing(14),
  justifyContent: 'center',
  alignItems: 'center',
})

const ButtonText = styled(Typo.ButtonText)(({ theme }) => ({
  color: theme.colors.white,
}))

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.white,
}))

const IdeaIcon = styled(Idea).attrs(({ theme }) => ({
  color: theme.colors.white,
}))``
