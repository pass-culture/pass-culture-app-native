import React from 'react'
import styled, { useTheme } from 'styled-components/native'

import { LocationModal as HomeLocationModal } from 'features/location/components/LocationModal'
import { SearchLocationModal } from 'features/location/components/SearchLocationModal'
import { getLocationTitle } from 'features/location/helpers/getLocationTitle'
import { VenueModal } from 'features/search/pages/modals/VenueModal/VenueModal'
import { SearchState } from 'features/search/types'
import { useLocation } from 'libs/geolocation'
import { useModal } from 'ui/components/modals/useModal'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { ArrowDown } from 'ui/svg/icons/ArrowDown'
import { LocationPointer } from 'ui/svg/icons/LocationPointer'
import { LocationPointerNotFilled } from 'ui/svg/icons/LocationPointerNotFilled'
import { getSpacing, Spacer, Typo } from 'ui/theme'

/**
 * Separation of types... for enforcement...
 */
export type useLocationForLocationWidgetDesktopHook = {
  title: string
  isWidgetHighlighted: boolean
  testId: string
}

export type ILocationWidgetDesktopChildrenProps = {
  visible: boolean
  dismissModal: VoidFunction
}

export type ILocationWidgetDesktopProps = {
  children: ({ visible, dismissModal }: ILocationWidgetDesktopChildrenProps) => React.ReactNode
}

type SearchLocationWidgetDesktopProps = {
  onSearch: (payload: Partial<SearchState>) => void
}

/**
 * Expose what is needed by the UI<ILocationWidgetDesktop>
 */
export const useLocationForLocationWidgetDesktop = (): useLocationForLocationWidgetDesktopHook => {
  const { isGeolocated, isCustomPosition, userPosition, place } = useLocation()
  const title = getLocationTitle(place, userPosition)
  const isWidgetHighlighted = isGeolocated || !!isCustomPosition
  const testId = 'Ouvrir la modale de localisation depuis le titre'

  return { title, isWidgetHighlighted, testId }
}

/**
 * The UI is the same so we just need a children as function
 * that will use modal props defined in
 * -> so children has to be a modal
 */
const ILocationWidgetDesktop: React.FC<ILocationWidgetDesktopProps> = ({ children }) => {
  const { icons } = useTheme()
  const {
    title: locationTitle,
    isWidgetHighlighted,
    testId,
  } = useLocationForLocationWidgetDesktop()

  const {
    visible: locationModalVisible,
    showModal: showLocationModal,
    hideModal: hideLocationModal,
  } = useModal()

  return (
    <React.Fragment>
      <LocationButton onPress={showLocationModal} testID={testId} accessibilityLabel={testId}>
        <NotShrunk>
          {isWidgetHighlighted ? (
            <LocationPointerFilled size={icons.sizes.extraSmall} testID="location pointer filled" />
          ) : (
            <SmallLocationPointerNotFilled
              size={icons.sizes.extraSmall}
              testID="location pointer not filled"
            />
          )}
        </NotShrunk>
        <Spacer.Row numberOfSpaces={1} />
        <LocationTitle>{locationTitle}</LocationTitle>
        <Spacer.Row numberOfSpaces={2} />
        <NotShrunk>
          <ArrowDown size={icons.sizes.extraSmall} />
        </NotShrunk>
      </LocationButton>
      {children({ visible: locationModalVisible, dismissModal: hideLocationModal })}
    </React.Fragment>
  )
}

/**
 * One widget for the home
 */
export const LocationWidgetDesktop = () => (
  <ILocationWidgetDesktop>
    {({ visible, dismissModal }) => (
      <HomeLocationModal visible={visible} dismissModal={dismissModal} />
    )}
  </ILocationWidgetDesktop>
)

/**
 * One widget for the search
 */
export const SearchLocationWidgetDesktop = ({ onSearch }: SearchLocationWidgetDesktopProps) => {
  const {
    visible: venueModalVisible,
    showModal: showVenueModal,
    hideModal: hideVenueModal,
  } = useModal()

  return (
    <ILocationWidgetDesktop>
      {({ visible, dismissModal }) => (
        <React.Fragment>
          <VenueModal
            visible={venueModalVisible}
            dismissModal={hideVenueModal}
            doAfterSearch={onSearch}
          />
          <SearchLocationModal
            visible={visible}
            dismissModal={dismissModal}
            showVenueModal={showVenueModal}
          />
        </React.Fragment>
      )}
    </ILocationWidgetDesktop>
  )
}

const LocationButton = styled(TouchableOpacity)({
  flexDirection: 'row',
  alignItems: 'center',
  height: getSpacing(8),
  flexShrink: 1,
})

const NotShrunk = styled.View({
  // We set to undefined to avoid shrink to be applied on the icons - otherwise their size is modified
  flexShrink: undefined,
})

const LocationPointerFilled = styled(LocationPointer).attrs(({ theme }) => ({
  color: theme.colors.primary,
  size: theme.icons.sizes.small,
}))({})

const SmallLocationPointerNotFilled = styled(LocationPointerNotFilled).attrs(({ theme }) => ({
  size: theme.icons.sizes.small,
}))``

const LocationTitle = styled(Typo.ButtonText).attrs({
  numberOfLines: 1,
})({
  flexShrink: 1,
})
