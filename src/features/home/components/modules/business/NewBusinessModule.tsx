import React, { memo, useCallback, useEffect, useState } from 'react'
import { useWindowDimensions } from 'react-native'
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
import { Typo, getSpacing, Spacer } from 'ui/theme'
import { customFocusOutline } from 'ui/theme/customFocusOutline/customFocusOutline'

const FIXED_SIZE = getSpacing(81.75)
const MAIN_MARGIN = getSpacing(6)
const SPECIFIC_GREY = '#2C2C2E'
const FULL_HEIGHT = { height: '100%' }
const FULL_WIDTH = { width: '100%' }

const UnmemoizedNewBusinessModule = (props: BusinessModuleProps) => {
  const focusProps = useHandleFocus()
  const {
    analyticsTitle,
    title,
    date,
    subtitle,
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
  const { width } = useWindowDimensions()
  const isLargeScreen = width > 700
  const onPress = useCallback(() => {
    if (!isDisabled) {
      setShouldRedirect(true)
    }
  }, [isDisabled])

  const { showInfoSnackBar } = useSnackBarContext()

  const logAndOpenUrl = (finalUrl: string) => {
    setShouldRedirect(false)
    analytics.logBusinessBlockClicked({ moduleName: analyticsTitle, moduleId, homeEntryId })
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

  const accessibilityLabel = subtitle ? `${title} ${subtitle}` : title

  return (
    <StyledTouchableOpacity
      {...focusProps}
      onPress={onPress}
      accessibilityRole={url ? AccessibilityRole.LINK : undefined}
      accessibilityLabel={accessibilityLabel}
      onMouseDown={(e) => e.preventDefault()}>
      {isLargeScreen ? (
        <FlexRow>
          <ColumnLargeScreen>
            <StyledBody testID="date" numberOfLines={1}>
              {date}
            </StyledBody>
            <StyledTitle1 testID="firstLine" numberOfLines={2}>
              {title}
            </StyledTitle1>
            <StyledTitle4 testID="secondLine" numberOfLines={2}>
              {subtitle}
            </StyledTitle4>
            {callToAction ? (
              <Row>
                <StyledButtonText testID="callToAction" numberOfLines={1}>
                  {callToAction}
                </StyledButtonText>
                <IconContainer>
                  <ArrowRightIcon />
                </IconContainer>
              </Row>
            ) : (
              <Spacer.Column numberOfSpaces={4} />
            )}
          </ColumnLargeScreen>
          <StyledImageBackgroundLargeScreen
            url={imageURL}
            height={FIXED_SIZE}
            testID="imageBusiness">
            <StyledLinearGradientLargeScreen />
          </StyledImageBackgroundLargeScreen>
        </FlexRow>
      ) : (
        <StyledImageBackground url={imageURL} height={FIXED_SIZE} testID="imageBusiness">
          <StyledLinearGradient>
            <Column>
              <StyledCaption testID="date" numberOfLines={1}>
                {date}
              </StyledCaption>
              <StyledTitle3 testID="firstLine" numberOfLines={2}>
                {title}
              </StyledTitle3>
              <StyledCaption testID="secondLine" numberOfLines={2}>
                {subtitle}
              </StyledCaption>
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
      )}
    </StyledTouchableOpacity>
  )
}

export const NewBusinessModule = memo(UnmemoizedNewBusinessModule)

const FlexRow = styled.View(({ theme }) => ({
  borderRadius: theme.borderRadius.radius,
  flexDirection: 'row',
  width: theme.appContentWidth - 2 * MAIN_MARGIN,
  ...FULL_HEIGHT,
}))

const StyledLinearGradient = styled(LinearGradient).attrs(({ theme }) => ({
  angle: 0,
  colors: [SPECIFIC_GREY, theme.colors.transparent],
  useAngle: true,
}))({ ...FULL_HEIGHT, ...FULL_WIDTH })

const StyledLinearGradientLargeScreen = styled(LinearGradient).attrs(({ theme }) => ({
  angle: 90,
  colors: [SPECIFIC_GREY, theme.colors.transparent],
  useAngle: true,
}))({ ...FULL_HEIGHT, ...FULL_WIDTH })

const StyledTouchableOpacity = styled(TouchableOpacity)<{
  onMouseDown: (e: Event) => void
  isFocus?: boolean
}>(({ theme, isFocus }) => ({
  textDecoration: 'none',
  borderRadius: theme.borderRadius.radius,
  height: FIXED_SIZE,
  width: theme.appContentWidth - 2 * MAIN_MARGIN,
  flexWrap: 'wrap',
  overflow: 'hidden',
  marginHorizontal: MAIN_MARGIN,
  ...customFocusOutline({ isFocus, color: theme.colors.black }),
  marginBottom: theme.home.spaceBetweenModules,
}))

const ColumnLargeScreen = styled.View({
  backgroundColor: SPECIFIC_GREY,
  width: '50%',
  flexDirection: 'column',
  ...FULL_HEIGHT,
  justifyContent: 'flex-end',
  paddingHorizontal: getSpacing(4),
})

const Column = styled.View({
  ...FULL_WIDTH,
  flexDirection: 'column',
  ...FULL_HEIGHT,
  justifyContent: 'flex-end',
  paddingHorizontal: getSpacing(4),
})

const StyledImageBackground = styled(ImageBackground)<{ height: number }>(({ height }) => ({
  height,
  ...FULL_WIDTH,
  borderRadius: getSpacing(2),
}))

const StyledImageBackgroundLargeScreen = styled(ImageBackground)<{ height: number }>(
  ({ height, theme }) => ({
    height,
    width: (theme.appContentWidth - 2 * MAIN_MARGIN) / 2,
    borderRadius: getSpacing(2),
  })
)

const Row = styled.View({
  flexDirection: 'row',
  paddingTop: getSpacing(4.5),
  gap: getSpacing(2),
  marginBottom: getSpacing(6),
})

const StyledTitle1 = styled(Typo.Title1)(({ theme }) => ({
  color: theme.colors.white,
}))

const StyledTitle3 = styled(Typo.Title3)(({ theme }) => ({
  color: theme.colors.white,
}))
const StyledCaption = styled(Typo.Caption)(({ theme }) => ({
  color: theme.colors.white,
}))

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.white,
}))
const StyledTitle4 = styled(Typo.Title4)(({ theme }) => ({
  color: theme.colors.white,
}))

const StyledButtonText = styled(Typo.ButtonText)(({ theme }) => ({
  color: theme.colors.white,
}))

const ArrowRightIcon = styled(ArrowRight).attrs(({ theme }) => ({
  size: theme.icons.sizes.extraSmall,
  color: theme.colors.white,
}))({
  flexShrink: 0,
})

const IconContainer = styled.View({ transform: 'rotate(-45deg)' })
