import { useNavigation } from '@react-navigation/native'
import React, { useCallback } from 'react'
import { Animated, Platform } from 'react-native'
import styled from 'styled-components/native'

import { HomeLocationModal } from 'features/location/components/HomeLocationModal'
import { SearchLocationModal } from 'features/location/components/SearchLocationModal'
import { ScreenOrigin } from 'features/location/enums'
import { getLocationTitle } from 'features/location/helpers/getLocationTitle'
import { useLocationWidgetTooltip } from 'features/location/helpers/useLocationWidgetTooltip'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { VenueModal } from 'features/search/pages/modals/VenueModal/VenueModal'
import { SearchState } from 'features/search/types'
import { useLocation } from 'libs/location'
import { styledButton } from 'ui/components/buttons/styledButton'
import { useModal } from 'ui/components/modals/useModal'
import { Tooltip } from 'ui/components/Tooltip'
import { Touchable } from 'ui/components/touchable/Touchable'
import { BicolorLocationPointer } from 'ui/svg/icons/BicolorLocationPointer'
import { LocationPointer } from 'ui/svg/icons/LocationPointer'
import { getSpacing, Typo } from 'ui/theme'

export const LOCATION_TITLE_MAX_WIDTH = getSpacing(20)
const WIDGET_HEIGHT = getSpacing(10 + 1 + 4) // roundedButton + padding + caption
const TOOLTIP_WIDTH = getSpacing(58)
const TOOLTIP_POINTER_DISTANCE_FROM_RIGHT = getSpacing(5)

interface LocationWidgetProps {
  screenOrigin: ScreenOrigin
}

export const LocationWidget = ({ screenOrigin }: LocationWidgetProps) => {
  const { navigate } = useNavigation<UseNavigationType>()
  const shouldShowHomeLocationModal = screenOrigin === ScreenOrigin.HOME

  const { isGeolocated, userPosition, place } = useLocation()
  const {
    isTooltipVisible,
    hideTooltip,
    widgetWidth,
    onWidgetLayout,
    touchableRef,
    enableTooltip,
  } = useLocationWidgetTooltip(screenOrigin)

  const locationTitle = getLocationTitle(place, userPosition)

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

  const isWidgetHighlighted = isGeolocated || !!place

  const onSearch = useCallback(
    (payload: Partial<SearchState>) => {
      navigate(...getTabNavConfig('Search', payload))
    },
    [navigate]
  )

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
        testID="Ouvrir la modale de localisation depuis le widget"
        onPress={showLocationModal}
        accessibilityLabel="Ouvrir la modale de localisation depuis le widget"
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
          <VenueModal
            visible={venueModalVisible}
            dismissModal={hideVenueModal}
            doAfterSearch={onSearch}
          />
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
