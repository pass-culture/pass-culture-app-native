import React, { memo, useCallback, useEffect, useState } from 'react'
import { View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import styled from 'styled-components/native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { BusinessModuleProps } from 'features/home/components/modules/business/BusinessModule'
import { getBusinessUrl } from 'features/home/components/modules/business/helpers/getBusinessUrl'
import { useShouldDisplayBusinessModule } from 'features/home/components/modules/business/helpers/useShouldDisplayBusinessModule'
import { openUrl } from 'features/navigation/helpers/openUrl'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { analytics } from 'libs/analytics'
import { ContentTypes } from 'libs/contentful/types'
import { useHandleFocus } from 'libs/hooks/useHandleFocus'
import { ImageBackground } from 'libs/resizing-image-on-demand/ImageBackground'
import { SNACK_BAR_TIME_OUT_LONG, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { ArrowRight } from 'ui/svg/icons/ArrowRight'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { customFocusOutline } from 'ui/theme/customFocusOutline/customFocusOutline'

const SIZE = getSpacing(81.75)
const UnmemoizedNewBusinessModule = (props: BusinessModuleProps) => {
  const focusProps = useHandleFocus()
  const {
    analyticsTitle: title,
    title: firstLine,
    date,
    subtitle: secondLine,
    image: imageURL,
    url,
    homeEntryId,
    index,
    shouldTargetNotConnectedUsers: targetNotConnectedUsersOnly,
    moduleId,
    localizationArea,
    callToAction,
  } = props
  const isDisabled = !url
  const { isLoggedIn, user, isUserLoading } = useAuthContext()

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
      analytics.logModuleDisplayedOnHomepage({
        moduleId,
        moduleType: ContentTypes.BUSINESS,
        index,
        homeEntryId,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldModuleBeDisplayed])

  if (!shouldModuleBeDisplayed) return null

  const accessibilityLabel = secondLine ? `${firstLine} ${secondLine}` : firstLine

  return (
    <StyledTouchableOpacity
      {...focusProps}
      onPress={onPress}
      accessibilityRole={url ? AccessibilityRole.LINK : undefined}
      accessibilityLabel={accessibilityLabel}
      onMouseDown={(e) => e.preventDefault()}>
      <ImageBackgroundContainer>
        <StyledImageBackground url={imageURL} height={SIZE} width={SIZE} testID="imageBusiness">
          <StyledLinearGradient>
            <Column>
              <View>
                <StyledCaption testID="date" numberOfLines={1}>
                  {date}
                </StyledCaption>
                <StyledTitle3 testID="firstLine" numberOfLines={2}>
                  {firstLine}
                </StyledTitle3>
                <StyledCaption testID="secondLine" numberOfLines={2}>
                  {secondLine}
                </StyledCaption>
              </View>
              {callToAction ? (
                <Row>
                  <StyledCaption testID="callToAction" numberOfLines={1}>
                    {callToAction}
                  </StyledCaption>
                  <IconContainer>
                    <ArrowRightIcon />
                  </IconContainer>
                </Row>
              ) : (
                <Spacer.Column numberOfSpaces={4} />
              )}
            </Column>
          </StyledLinearGradient>
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
  height: '100%',
}))

const StyledLinearGradient = styled(LinearGradient).attrs(({ theme }) => ({
  colors: [theme.colors.transparent, '#2C2C2E'],
  borderRadius: theme.borderRadius.radius,
}))({ height: '100%', width: '100%' })

const StyledTouchableOpacity = styled(TouchableOpacity)<{
  onMouseDown: (e: Event) => void
  isFocus?: boolean
}>(({ theme, isFocus }) => ({
  textDecoration: 'none',
  borderRadius: theme.borderRadius.radius,
  height: SIZE,
  width: SIZE,
  flexWrap: 'wrap',
  marginHorizontal: getSpacing(6),
  ...customFocusOutline({ isFocus, color: theme.colors.black }),
  marginBottom: theme.home.spaceBetweenModules,
}))

const Row = styled.View({
  flexDirection: 'row',
  paddingTop: getSpacing(4.5),
  gap: getSpacing(2),
  marginBottom: getSpacing(6),
})

const Column = styled.View({
  flexDirection: 'column',
  flex: 1,
  height: '100%',
  justifyContent: 'flex-end',
  paddingHorizontal: getSpacing(4),
})

const StyledImageBackground = styled(ImageBackground)<{ height: number }>((props) => ({
  height: props.height,
  width: '100%',
  justifyContent: 'center',
  backgroundColor: props.theme.colors.primary,
  borderRadius: getSpacing(2),
}))

const StyledTitle3 = styled(Typo.Title3)(({ theme }) => ({
  color: theme.colors.white,
  marginVertical: getSpacing(1),
  zIndex: 10,
}))

const StyledCaption = styled(Typo.Caption)(({ theme }) => ({
  color: theme.colors.white,
}))

const ArrowRightIcon = styled(ArrowRight).attrs(({ theme }) => ({
  size: theme.icons.sizes.extraSmall,
  color: theme.colors.white,
}))({
  flexShrink: 0,
})

const IconContainer = styled.View({ transform: 'rotate(-45deg)' })
