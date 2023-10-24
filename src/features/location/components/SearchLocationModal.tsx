import React, { useCallback, useState } from 'react'
import { Keyboard } from 'react-native'
import styled from 'styled-components/native'

import { LocationModalButton } from 'features/location/components/LocationModalButton'
import { LOCATION_PLACEHOLDER } from 'features/location/constants'
import { LocationMode } from 'features/location/enums'
import { useLocationModal } from 'features/location/helpers/useLocationModal'
import { useSearch } from 'features/search/context/SearchWrapper'
import { LocationType } from 'features/search/enums'
import { analytics } from 'libs/analytics'
import { GeolocPermissionState } from 'libs/geolocation'
import { SuggestedPlace } from 'libs/place'
import { LocationSearchFilters } from 'shared/location/LocationSearchFilters'
import { LocationSearchInput } from 'shared/location/LocationSearchInput'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { useKeyboardEvents } from 'ui/components/keyboard/useKeyboardEvents'
import { AppModal } from 'ui/components/modals/AppModal'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { Separator } from 'ui/components/Separator'
import { Spacer } from 'ui/components/spacer/Spacer'
import { Close } from 'ui/svg/icons/Close'
import { LocationBuildingFilled } from 'ui/svg/icons/LocationBuildingFilled'
import { MagnifyingGlassFilled } from 'ui/svg/icons/MagnifyingGlassFilled'
import { PositionFilled } from 'ui/svg/icons/PositionFilled'
import { Typo, getSpacing } from 'ui/theme'

const DEFAULT_RADIUS = 50
const DEFAULT_DIGITAL_OFFERS_SELECTION = false

interface LocationModalProps {
  visible: boolean
  dismissModal: () => void
  showVenueModal: () => void
}

export const SearchLocationModal = ({
  visible,
  dismissModal,
  showVenueModal,
}: LocationModalProps) => {
  const {
    isGeolocated,
    placeQuery,
    setPlaceQuery,
    selectedPlace,
    setSelectedPlace,
    selectedLocationMode,
    setSelectedLocationMode,
    geolocationModeColor,
    customLocationModeColor,
    onSetSelectedPlace,
    onResetPlace,
    setPlaceGlobally,
    onModalHideRef,
    permissionState,
    requestGeolocPermission,
    showGeolocPermissionModal,
    isCurrentLocationMode,
  } = useLocationModal(visible)

  const { searchState, dispatch } = useSearch()

  const [keyboardHeight, setKeyboardHeight] = useState(0)

  const getInitialRadiusValue = () => {
    if (
      searchState.locationFilter.locationType === LocationType.PLACE ||
      searchState.locationFilter.locationType === LocationType.AROUND_ME
    ) {
      return searchState.locationFilter.aroundRadius ?? DEFAULT_RADIUS
    }
    return DEFAULT_RADIUS
  }

  const [aroundRadius, setAroundRadius] = useState(getInitialRadiusValue)
  const [includeDigitalOffers, setIncludeDigitalOffers] = useState(
    searchState.includeDigitalOffers ?? DEFAULT_DIGITAL_OFFERS_SELECTION
  )

  const runGeolocationDialogs = useCallback(async () => {
    const selectGeoLocationMode = () => setSelectedLocationMode(LocationMode.GEOLOCATION)
    if (permissionState === GeolocPermissionState.NEVER_ASK_AGAIN) {
      setPlaceGlobally(null)
      dismissModal()
      onModalHideRef.current = showGeolocPermissionModal
    } else {
      await requestGeolocPermission({
        onAcceptance: selectGeoLocationMode,
      })
    }
  }, [
    dismissModal,
    permissionState,
    setPlaceGlobally,
    onModalHideRef,
    showGeolocPermissionModal,
    requestGeolocPermission,
    setSelectedLocationMode,
  ])

  const selectLocationMode = useCallback(
    (mode: LocationMode) => () => {
      if (mode === LocationMode.GEOLOCATION) {
        runGeolocationDialogs()
      } else {
        setSelectedLocationMode(mode)
      }
    },
    [runGeolocationDialogs, setSelectedLocationMode]
  )

  const onSubmit = () => {
    if (selectedLocationMode === LocationMode.CUSTOM_POSITION && selectedPlace) {
      setPlaceGlobally(selectedPlace)
      dispatch({
        type: 'SET_LOCATION_FILTERS',
        payload: {
          locationFilter: { place: selectedPlace, locationType: LocationType.PLACE, aroundRadius },
          includeDigitalOffers,
        },
      })
      analytics.logUserSetLocation('search')
    } else if (selectedLocationMode === LocationMode.GEOLOCATION) {
      setPlaceGlobally(null)
      dispatch({
        type: 'SET_LOCATION_FILTERS',
        payload: {
          locationFilter: { locationType: LocationType.AROUND_ME, aroundRadius },
          includeDigitalOffers,
        },
      })
    }
    dismissModal()
  }

  const onClose = () => {
    setAroundRadius(getInitialRadiusValue)
    setIncludeDigitalOffers(searchState.includeDigitalOffers ?? DEFAULT_DIGITAL_OFFERS_SELECTION)
    dismissModal()
  }

  const onValuesChange = useCallback(
    (newValues: number[]) => {
      setAroundRadius(newValues[0])
    },
    [setAroundRadius]
  )

  const onPlaceSelection = (place: SuggestedPlace) => {
    onSetSelectedPlace(place)
    Keyboard.dismiss()
  }

  const onPressShowVenueModal = () => {
    dismissModal()
    onModalHideRef.current = showVenueModal
  }

  useKeyboardEvents({
    onBeforeShow(data) {
      setKeyboardHeight(data.keyboardHeight)
    },
    onBeforeHide() {
      setKeyboardHeight(0)
    },
  })

  return (
    <AppModal
      visible={visible}
      title=""
      noPadding
      isUpToStatusBar
      scrollEnabled={false}
      onModalHide={onModalHideRef.current}
      keyboardShouldPersistTaps="handled"
      customModalHeader={
        <HeaderContainer>
          <ModalHeader
            title="Localisation"
            rightIconAccessibilityLabel="Fermer la modale"
            rightIcon={Close}
            onRightIconPress={onClose}
          />
        </HeaderContainer>
      }>
      <StyledScrollView>
        <Spacer.Column numberOfSpaces={6} />
        <LocationModalButton
          onPress={selectLocationMode(LocationMode.GEOLOCATION)}
          icon={PositionFilled}
          color={geolocationModeColor}
          title="Utiliser ma position actuelle"
          subtitle={isGeolocated ? undefined : 'Géolocalisation désactivée'}
        />
        {!!isCurrentLocationMode(LocationMode.GEOLOCATION) && (
          <React.Fragment>
            <Spacer.Column numberOfSpaces={4} />
            <LocationSearchFilters
              aroundRadius={aroundRadius}
              onValuesChange={onValuesChange}
              includeDigitalOffers={includeDigitalOffers}
              setIncludeDigitalOffers={setIncludeDigitalOffers}
            />
          </React.Fragment>
        )}
        <Spacer.Column numberOfSpaces={6} />
        <Separator.Horizontal />
        <Spacer.Column numberOfSpaces={6} />
        <LocationModalButton
          onPress={selectLocationMode(LocationMode.CUSTOM_POSITION)}
          icon={MagnifyingGlassFilled}
          color={customLocationModeColor}
          title="Choisir une localisation"
          subtitle={LOCATION_PLACEHOLDER}
        />
        {!!isCurrentLocationMode(LocationMode.CUSTOM_POSITION) && (
          <React.Fragment>
            <LocationSearchInput
              selectedPlace={selectedPlace}
              setSelectedPlace={setSelectedPlace}
              placeQuery={placeQuery}
              setPlaceQuery={setPlaceQuery}
              onResetPlace={onResetPlace}
              onSetSelectedPlace={onPlaceSelection}
            />
            <Spacer.Column numberOfSpaces={4} />
            {!!selectedPlace && (
              <LocationSearchFilters
                aroundRadius={aroundRadius}
                onValuesChange={onValuesChange}
                includeDigitalOffers={includeDigitalOffers}
                setIncludeDigitalOffers={setIncludeDigitalOffers}
              />
            )}
          </React.Fragment>
        )}
        <Spacer.Column numberOfSpaces={8} />
        <ButtonContainer>
          <ButtonPrimary
            wording="Valider la localisation"
            disabled={!selectedPlace && selectedLocationMode !== LocationMode.GEOLOCATION}
            onPress={onSubmit}
          />
        </ButtonContainer>
        <Spacer.Column numberOfSpaces={8} />
        <Separator.Horizontal />
        <Spacer.Column numberOfSpaces={4} />
        <Typo.Body>Tu peux aussi choisir un point de vente précis</Typo.Body>
        <Spacer.Column numberOfSpaces={1} />
        <ButtonTertiaryBlack
          wording="Trouver un point de vente"
          icon={LocationBuildingFilled}
          onPress={onPressShowVenueModal}
          justifyContent="flex-start"
        />
        <Spacer.Column numberOfSpaces={keyboardHeight / 4} />
      </StyledScrollView>
    </AppModal>
  )
}

const ButtonContainer = styled.View({
  alignItems: 'center',
})

const StyledScrollView = styled.ScrollView({
  paddingHorizontal: getSpacing(6),
})

const HeaderContainer = styled.View({
  padding: getSpacing(4),
  width: '100%',
})
