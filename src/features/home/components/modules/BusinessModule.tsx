import React, { memo, useEffect, useState } from 'react'
import { PixelRatio } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { useAuthContext } from 'features/auth/AuthContext'
import { BusinessPane, ContentTypes } from 'features/home/contentful'
import { openUrl } from 'features/navigation/helpers'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { analytics } from 'libs/firebase/analytics'
import { useHandleFocus } from 'libs/hooks/useHandleFocus'
import { Image } from 'libs/resizing-image-on-demand/Image'
import { ImageBackground } from 'libs/resizing-image-on-demand/ImageBackground'
import { useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { ArrowNext } from 'ui/svg/icons/ArrowNext'
import { Idea } from 'ui/svg/icons/Idea'
import { Typo, getSpacing, MARGIN_DP, LENGTH_XS, RATIO_BUSINESS, Spacer } from 'ui/theme'
import { customFocusOutline } from 'ui/theme/customFocusOutline/customFocusOutline'

import { getBusinessUrl, showBusinessModule } from './BusinessModule.utils'

export interface BusinessModuleProps extends BusinessPane {
  homeEntryId: string | undefined
  index: number
}

const UnmemoizedBusinessModule = (props: BusinessModuleProps) => {
  const { onFocus, onBlur, isFocus } = useHandleFocus()
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
  const { isLoggedIn, user, isUserLoading } = useAuthContext()
  const imageWidth = appContentWidth - 2 * MARGIN_DP
  const imageHeight = Math.min(
    PixelRatio.roundToNearestPixel(imageWidth * RATIO_BUSINESS),
    LENGTH_XS
  )

  const [shouldRedirect, setShouldRedirect] = useState(false)

  const { showInfoSnackBar } = useSnackBarContext()

  const logAndOpenUrl = (finalUrl: string) => {
    setShouldRedirect(false)
    analytics.logBusinessBlockClicked({ moduleName: title, moduleId, homeEntryId })
    openUrl(finalUrl)
  }

  useEffect(() => {
    if (!url || !shouldRedirect) return
    const businessUrl = getBusinessUrl(url, user?.email)
    if (businessUrl) logAndOpenUrl(businessUrl)
    else if (isUserLoading) {
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
      <StyledTouchableHighlight
        accessibilityRole={url ? AccessibilityRole.LINK : undefined}
        onPress={isDisabled ? undefined : () => setShouldRedirect(true)}
        onFocus={onFocus}
        onBlur={onBlur}
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
      </StyledTouchableHighlight>
      <Spacer.Row numberOfSpaces={6} />
    </Row>
  )
}

export const BusinessModule = memo(UnmemoizedBusinessModule)

const Row = styled.View({
  flexDirection: 'row',
  paddingBottom: getSpacing(6),
})

//TODO(PC-19116): See if we can use touchableLink
const StyledTouchableHighlight = styled.TouchableHighlight.attrs(({ theme }) => ({
  hoverUnderlineColor: theme.colors.white,
}))<{ isFocus?: boolean }>(({ theme, isFocus }) => ({
  textDecoration: 'none',
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
