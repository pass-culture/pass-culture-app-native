import React, { memo, useEffect, useState } from 'react'
import { PixelRatio } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { useAuthContext } from 'features/auth/AuthContext'
import { BusinessPane, ContentTypes } from 'features/home/contentful'
import { openUrl } from 'features/navigation/helpers'
import { useUserProfileInfo } from 'features/profile/api'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { analytics } from 'libs/firebase/analytics'
import { Image } from 'libs/resizing-image-on-demand/Image'
import { ImageBackground } from 'libs/resizing-image-on-demand/ImageBackground'
import { useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { ArrowNext } from 'ui/svg/icons/ArrowNext'
import { Idea } from 'ui/svg/icons/Idea'
import { Typo, getSpacing, MARGIN_DP, LENGTH_XS, RATIO_BUSINESS, Spacer } from 'ui/theme'
import { customFocusOutline } from 'ui/theme/customFocusOutline/customFocusOutline'

import { fillUrlEmail, shouldUrlBeFilled, showBusinessModule } from './BusinessModule.utils'

export interface BusinessModuleProps extends BusinessPane {
  homeEntryId: string | undefined
  index: number
}

const UnmemoizedBusinessModule = (props: BusinessModuleProps) => {
  const [isFocus, setIsFocus] = useState(false)
  const {
    title,
    firstLine,
    secondLine,
    leftIcon,
    image: imageURL,
    url,
    homeEntryId,
    index,
    targetNotConnectedUsersOnly,
    moduleId,
  } = props
  const isDisabled = !url
  const { appContentWidth } = useTheme()
  const { isLoggedIn } = useAuthContext()
  const imageWidth = appContentWidth - 2 * MARGIN_DP
  const imageHeight = Math.min(
    PixelRatio.roundToNearestPixel(imageWidth * RATIO_BUSINESS),
    LENGTH_XS
  )

  const [shouldRedirect, setShouldRedirect] = useState(false)

  const { data: user, isLoading: isUserLoading } = useUserProfileInfo()
  const { showInfoSnackBar } = useSnackBarContext()

  const logAndOpenUrl = (finalUrl: string) => {
    setShouldRedirect(false)
    analytics.logBusinessBlockClicked({ moduleName: title, moduleId, homeEntryId })
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
      showInfoSnackBar({ message: 'Redirection en cours' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, user, shouldRedirect])

  const shouldModuleBeDisplayed = showBusinessModule(targetNotConnectedUsersOnly, isLoggedIn)

  useEffect(() => {
    if (shouldModuleBeDisplayed) {
      analytics.logModuleDisplayedOnHomepage(moduleId, ContentTypes.BUSINESS, index, homeEntryId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldModuleBeDisplayed])

  if (!shouldModuleBeDisplayed) return <React.Fragment />

  return (
    <Row>
      <Spacer.Row numberOfSpaces={6} />
      <StyledTouchableLink
        highlight
        accessibilityRole={url ? AccessibilityRole.LINK : undefined}
        onBeforeNavigate={() => setShouldRedirect(true)}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        isFocus={isFocus}
        disabled={isDisabled}>
        <ImageContainer>
          <StyledImageBackground
            url={imageURL}
            height={imageHeight}
            width={imageWidth}
            testID="imageBusiness">
            <Container>
              <IconContainer>
                {leftIcon ? <StyledImage url={leftIcon} /> : <IdeaIcon />}
              </IconContainer>
              <TextContainer>
                <ButtonText testID="firstLine">{firstLine}</ButtonText>
                <StyledBody numberOfLines={2}>{secondLine}</StyledBody>
              </TextContainer>
              {!isDisabled && (
                <IconContainer>
                  <ArrowNextIcon />
                </IconContainer>
              )}
            </Container>
          </StyledImageBackground>
        </ImageContainer>
      </StyledTouchableLink>
      <Spacer.Row numberOfSpaces={6} />
    </Row>
  )
}

export const BusinessModule = memo(UnmemoizedBusinessModule)

const Row = styled.View({
  flexDirection: 'row',
  paddingBottom: getSpacing(6),
})

const StyledTouchableLink = styled(TouchableLink).attrs(({ theme }) => ({
  hoverUnderlineColor: theme.colors.white,
}))<{ isFocus?: boolean }>(({ theme, isFocus }) => ({
  borderRadius: theme.borderRadius.radius,
  ...customFocusOutline({ isFocus, color: theme.colors.black }),
}))

const ImageContainer = styled.View(({ theme }) => ({
  borderRadius: theme.borderRadius.radius,
  overflow: 'hidden',
  maxHeight: LENGTH_XS,
}))

const StyledImage = styled(Image)(({ theme }) => ({
  width: getSpacing(14),
  height: getSpacing(14),
  tintColor: theme.colors.white,
}))

const StyledImageBackground = styled(ImageBackground)<{ width: number; height: number }>(
  (props) => ({
    height: props.height,
    width: props.width,
    justifyContent: 'center',
    backgroundColor: props.theme.colors.primary,
  })
)

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

const ArrowNextIcon = styled(ArrowNext).attrs(({ theme }) => ({
  color: theme.colors.white,
  size: theme.icons.sizes.small,
}))``
