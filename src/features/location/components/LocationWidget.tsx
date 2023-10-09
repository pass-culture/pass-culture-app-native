import React, { useCallback, useEffect } from 'react'
import { Animated, LayoutChangeEvent, Platform } from 'react-native'
import styled from 'styled-components/native'

import { HomeLocationModal } from 'features/location/components/HomeLocationModal'
import { SearchLocationModal } from 'features/location/components/SearchLocationModal'
import { ScreenOrigin } from 'features/location/enums'
import { VenueModal } from 'features/search/pages/modals/VenueModal/VenueModal'
import { useLocation } from 'libs/geolocation'
import { useSplashScreenContext } from 'libs/splashscreen'
import { storage } from 'libs/storage'
import { styledButton } from 'ui/components/buttons/styledButton'
import { useModal } from 'ui/components/modals/useModal'
import { Tooltip } from 'ui/components/Tooltip'
import { Touchable } from 'ui/components/touchable/Touchable'
import { BicolorLocationPointer } from 'ui/svg/icons/BicolorLocationPointer'
import { LocationPointer } from 'ui/svg/icons/LocationPointer'
import { getSpacing, Typo } from 'ui/theme'

const LOCATION_TITLE_MAX_WIDTH = getSpacing(20)
const WIDGET_HEIGHT = getSpacing(10 + 1 + 4) // roundedButton + padding + caption
const TOOLTIP_WIDTH = getSpacing(58)
const TOOLTIP_POINTER_DISTANCE_FROM_RIGHT = getSpacing(5)

interface LocationWidgetProps {
  screenOrigin: ScreenOrigin
}

export const LocationWidget = ({ screenOrigin }: LocationWidgetProps) => {
  const touchableRef = React.useRef<HTMLButtonElement>()
  const [isTooltipVisible, setIsTooltipVisible] = React.useState(false)
  const [widgetWidth, setWidgetWidth] = React.useState<number | undefined>()
  const { isSplashScreenHidden } = useSplashScreenContext()
  const enableTooltip = screenOrigin === ScreenOrigin.HOME
  const shouldShowHomeLocationModal = enableTooltip

  const { isGeolocated, isCustomPosition, userPosition, place } = useLocation()
  const getLocationTitle = useCallback(() => {
    if (place !== null) {
      return place.label
    }
    if (userPosition !== null) {
      return 'Ma position'
    }
    return 'Me localiser'
  }, [place, userPosition])

  const locationTitle = getLocationTitle()

  const hideTooltip = useCallback(() => setIsTooltipVisible(false), [setIsTooltipVisible])

  // native resizing on layout
  function onWidgetLayout(event: LayoutChangeEvent) {
    const { width } = event.nativeEvent.layout
    setWidgetWidth(width)
  }

  // web resizing on layout
  useEffect(() => {
    if (Platform.OS === 'web' && touchableRef.current) {
      const { width } = touchableRef.current.getBoundingClientRect()
      setWidgetWidth(width)
    }
  }, [])

  useEffect(() => {
    if (!isSplashScreenHidden || !enableTooltip) return

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

  const {
    visible: locationModalVisible,
    showModal: showLocationModal,
    hideModal: hideLocationModal,
  } = useModal()

  const {
    visible: venueModalVisible,
    showModal: showVenueModal,
    hideModal: hideVenueModal,
  } = useModal()

  const isWidgetHighlighted = isGeolocated || !!isCustomPosition

  return (
    <React.Fragment>
      {enableTooltip ? (
        <StyledTooltip
          label="Configure ta position et découvre les offres dans la zone géographique de ton choix."
          isVisible={isTooltipVisible}
          onHide={hideTooltip}
          widgetWidth={widgetWidth}
        />
      ) : null}
      <StyledTouchable
        onPress={showLocationModal}
        accessibilityLabel="Ouvrir la modale de localisation"
        {...(Platform.OS === 'web' ? { ref: touchableRef } : { onLayout: onWidgetLayout })}>
        <IconContainer isActive={isWidgetHighlighted}>
          {isWidgetHighlighted ? <LocationPointerFilled /> : <LocationPointerNotFilled />}
        </IconContainer>
        <StyledCaption numberOfLines={1}>{locationTitle}</StyledCaption>
      </StyledTouchable>
      {shouldShowHomeLocationModal ? (
        <HomeLocationModal visible={locationModalVisible} dismissModal={hideLocationModal} />
      ) : (
        <React.Fragment>
          <VenueModal visible={venueModalVisible} dismissModal={hideVenueModal} />
          <SearchLocationModal
            visible={locationModalVisible}
            dismissModal={hideLocationModal}
            showVenueModal={showVenueModal}
          />
        </React.Fragment>
      )}
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

const StyledTouchable = styledButton(Touchable)({
  alignItems: 'center',
  marginLeft: getSpacing(2),
})

const StyledCaption = styled(Typo.Caption)({
  paddingTop: getSpacing(1),
  maxWidth: LOCATION_TITLE_MAX_WIDTH,
})

const IconContainer = styled(Animated.View)<{ isActive: boolean }>(({ theme, isActive }) => ({
  width: theme.buttons.roundedButton.size,
  height: theme.buttons.roundedButton.size,
  borderRadius: theme.buttons.roundedButton.size,
  border: isActive ? 2 : 1,
  justifyContent: 'center',
  alignItems: 'center',
  borderColor: isActive ? theme.colors.black : theme.colors.greyDark,
}))

const LocationPointerFilled = styled(LocationPointer).attrs(({ theme }) => ({
  color: theme.colors.primary,
  size: theme.icons.sizes.small,
}))({})

const LocationPointerNotFilled = styled(BicolorLocationPointer).attrs(({ theme }) => ({
  color: theme.colors.black,
  color2: theme.colors.black,
  size: theme.icons.sizes.small,
}))``
