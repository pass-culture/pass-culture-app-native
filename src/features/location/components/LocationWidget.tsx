import React, { useEffect } from 'react'
import { Animated, LayoutChangeEvent } from 'react-native'
import styled from 'styled-components/native'

import { LocationModal } from 'features/location/components/LocationModal'
import { useGeolocation } from 'libs/geolocation'
import { useSplashScreenContext } from 'libs/splashscreen'
import { storage } from 'libs/storage'
import { useModal } from 'ui/components/modals/useModal'
import { Tooltip } from 'ui/components/Tooltip'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { BicolorLocationPointer } from 'ui/svg/icons/BicolorLocationPointer'
import { getSpacing, Typo } from 'ui/theme'

const LOCATION_TITLE_MAX_WIDTH = getSpacing(20)
const WIDGET_HEIGHT = getSpacing(10 + 1 + 4) // roundedButton + padding + caption
const TOOLTIP_WIDTH = getSpacing(58)
const TOOLTIP_POINTER_DISTANCE_FROM_RIGHT = getSpacing(5)

export const LocationWidget: React.FC = () => {
  const [isTooltipVisible, setIsTooltipVisible] = React.useState(false)
  const [widgetWidth, setWidgetWidth] = React.useState<number | undefined>()
  const { userPosition } = useGeolocation()
  const { isSplashScreenHidden } = useSplashScreenContext()

  const hideTooltip = () => setIsTooltipVisible(false)

  function onWidgetLayout(event: LayoutChangeEvent) {
    const { width } = event.nativeEvent.layout
    setWidgetWidth(width)
  }

  useEffect(() => {
    if (!isSplashScreenHidden) return

    const displayTooltipIfNeeded = async () => {
      const timesLocationTooltipHasBeenDisplayed = Number(
        await storage.readString('times_location_tooltip_has_been_displayed')
      )
      setIsTooltipVisible(timesLocationTooltipHasBeenDisplayed < 1 || !userPosition)
      await storage.saveString(
        'times_location_tooltip_has_been_displayed',
        String(timesLocationTooltipHasBeenDisplayed + 1)
      )
    }
    const timeoutOn = setTimeout(displayTooltipIfNeeded, 1000)
    const timeoutOff = setTimeout(hideTooltip, 9000)

    return () => {
      clearTimeout(timeoutOn)
      clearTimeout(timeoutOff)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- should only be called on startup
  }, [isSplashScreenHidden])

  const locationTitle = 'Me localiser'

  const {
    visible: locationModalVisible,
    showModal: showLocationModal,
    hideModal: hideLocationModal,
  } = useModal()

  return (
    <React.Fragment>
      <StyledTooltip
        label="Configure ta position et découvre les offres dans la zone géographique de ton choix."
        isVisible={isTooltipVisible}
        onHide={hideTooltip}
        widgetWidth={widgetWidth}
      />
      <StyledTouchable
        onPress={showLocationModal}
        accessibilityLabel="Ouvrir la modale de localisation"
        onLayout={onWidgetLayout}>
        <IconContainer>
          <LocationPointer />
        </IconContainer>
        <StyledCaption numberOfLines={1}>{locationTitle}</StyledCaption>
      </StyledTouchable>
      <LocationModal visible={locationModalVisible} dismissModal={hideLocationModal} />
    </React.Fragment>
  )
}

const StyledTooltip = styled(Tooltip)<{ widgetWidth?: number }>(({ theme, widgetWidth }) => ({
  position: 'absolute',
  top: WIDGET_HEIGHT + getSpacing(2),
  right: (widgetWidth ?? LOCATION_TITLE_MAX_WIDTH) / 2 - TOOLTIP_POINTER_DISTANCE_FROM_RIGHT,
  zIndex: theme.zIndex.header,
  width: TOOLTIP_WIDTH,
}))

const StyledTouchable = styled(TouchableOpacity)({
  alignItems: 'center',
  marginLeft: getSpacing(2),
})

const StyledCaption = styled(Typo.Caption)({
  paddingTop: getSpacing(1),
  maxWidth: LOCATION_TITLE_MAX_WIDTH,
})

const IconContainer = styled(Animated.View)(({ theme }) => ({
  width: theme.buttons.roundedButton.size,
  height: theme.buttons.roundedButton.size,
  borderRadius: theme.buttons.roundedButton.size,
  border: 1,
  justifyContent: 'center',
  alignItems: 'center',
  borderColor: theme.colors.greyDark,
}))

export const LocationPointer = styled(BicolorLocationPointer).attrs(({ theme }) => ({
  color: theme.colors.black,
  color2: theme.colors.black,
  size: theme.icons.sizes.small,
}))``
