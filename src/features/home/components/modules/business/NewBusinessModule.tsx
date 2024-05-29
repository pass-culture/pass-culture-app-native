import React, { memo, useCallback, useEffect, useState } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { NewBusinessModuleProps } from 'features/home/components/modules/business/BusinessModule'
import { getBusinessUrl } from 'features/home/components/modules/business/helpers/getBusinessUrl'
import { useShouldDisplayBusinessModule } from 'features/home/components/modules/business/helpers/useShouldDisplayBusinessModule'
import { openUrl } from 'features/navigation/helpers/openUrl'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { analytics } from 'libs/analytics'
import { ContentTypes } from 'libs/contentful/types'
import { useHandleFocus } from 'libs/hooks/useHandleFocus'
import { ImageBackground } from 'libs/resizing-image-on-demand/ImageBackground'
import { ButtonPrimaryBlack } from 'ui/components/buttons/ButtonPrimaryBlack'
import { styledButton } from 'ui/components/buttons/styledButton'
import { SNACK_BAR_TIME_OUT_LONG, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { Typo, getSpacing, MARGIN_DP } from 'ui/theme'
import { customFocusOutline } from 'ui/theme/customFocusOutline/customFocusOutline'

const HEIGHT = getSpacing(45)

const UnmemoizedNewBusinessModule = (props: NewBusinessModuleProps) => {
  const focusProps = useHandleFocus()
  const {
    analyticsTitle: title,
    title: firstLine,
    subtitle: secondLine,
    image: imageURL,
    imageWeb: imageWebURL,
    url,
    homeEntryId,
    index,
    shouldTargetNotConnectedUsers: targetNotConnectedUsersOnly,
    moduleId,
    localizationArea,
    wordingCTA,
  } = props
  const isDisabled = !url
  const { appContentWidth, isDesktopViewport } = useTheme()
  const { isLoggedIn, user, isUserLoading } = useAuthContext()
  const imageWidth = appContentWidth - 2 * MARGIN_DP

  const [shouldRedirect, setShouldRedirect] = useState(false)

  const onPress = useCallback(() => {
    if (!isDisabled) {
      setShouldRedirect(true)
    }
  }, [isDisabled])

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
      showInfoSnackBar({ message: 'Redirection en cours', timeout: SNACK_BAR_TIME_OUT_LONG })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, user, shouldRedirect])

  const shouldModuleBeDisplayed = useShouldDisplayBusinessModule(
    targetNotConnectedUsersOnly,
    isLoggedIn,
    localizationArea
  )

  useEffect(() => {
    if (shouldModuleBeDisplayed) {
      analytics.logModuleDisplayedOnHomepage(moduleId, ContentTypes.BUSINESS, index, homeEntryId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldModuleBeDisplayed])

  if (!shouldModuleBeDisplayed) return null

  const accessibilityLabel = secondLine ? `${firstLine} ${secondLine}` : firstLine
  const imageToDisplay = isDesktopViewport && imageWebURL ? imageWebURL : imageURL

  return (
    <StyledTouchableOpacity
      {...focusProps}
      onPress={onPress}
      accessibilityRole={url ? AccessibilityRole.LINK : undefined}
      accessibilityLabel={accessibilityLabel}
      onMouseDown={(e) => e.preventDefault()}>
      <ImageBackgroundContainer>
        <StyledImageBackground
          url={imageToDisplay}
          height={HEIGHT}
          width={imageWidth}
          testID="imageBusiness">
          <Row>
            <Column>
              <ButtonText testID="firstLine" numberOfLines={2}>
                {firstLine}
              </ButtonText>
              <StyledBody numberOfLines={2} testID="secondLine">
                {secondLine}
              </StyledBody>
            </Column>
            <ButtonContainer>
              <StyledButton
                wording={wordingCTA}
                onPress={onPress}
                accessibilityLabel={accessibilityLabel}
              />
            </ButtonContainer>
          </Row>
        </StyledImageBackground>
      </ImageBackgroundContainer>
    </StyledTouchableOpacity>
  )
}

export const NewBusinessModule = memo(UnmemoizedNewBusinessModule)

const ImageBackgroundContainer = styled.View(({ theme }) => ({
  borderRadius: theme.borderRadius.radius,
  overflow: 'hidden',
  width: '100%',
}))

const StyledButton = styledButton(ButtonPrimaryBlack)({
  width: getSpacing(28.5),
  height: getSpacing(10),
})

const ButtonContainer = styled.View({
  height: '100%',
  justifyContent: 'flex-end',
  alignContent: 'flex-end',
})

const StyledTouchableOpacity = styled(TouchableOpacity)<{
  onMouseDown: (e: Event) => void
  isFocus?: boolean
}>(({ theme, isFocus }) => ({
  textDecoration: 'none',
  borderRadius: theme.borderRadius.radius,
  height: HEIGHT,
  flexWrap: 'wrap',
  marginHorizontal: getSpacing(6),
  ...customFocusOutline({ isFocus, color: theme.colors.black }),
  marginBottom: theme.home.spaceBetweenModules,
}))

const Row = styled.View({
  flexDirection: 'row',
  height: '100%',
  gap: getSpacing(2),
  padding: getSpacing(4),
})
const Column = styled.View({
  flexDirection: 'column',
  flex: 1,
  height: '100%',
  justifyContent: 'flex-end',
})

const StyledImageBackground = styled(ImageBackground)<{ height: number }>((props) => ({
  height: props.height,
  width: '100%',
  justifyContent: 'center',
  backgroundColor: props.theme.colors.primary,
  borderRadius: getSpacing(2),
}))

const ButtonText = styled(Typo.ButtonText)(({ theme }) => ({
  color: theme.colors.white,
}))

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.white,
}))
