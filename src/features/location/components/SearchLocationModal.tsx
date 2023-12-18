import { useNavigation } from '@react-navigation/native'
import React, { useCallback, useState, useEffect } from 'react'
import { Keyboard } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { LocationModalButton } from 'features/location/components/LocationModalButton'
import { LOCATION_PLACEHOLDER } from 'features/location/constants'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { DEFAULT_RADIUS } from 'features/search/constants'
import { useSearch } from 'features/search/context/SearchWrapper'
import { analytics } from 'libs/analytics'
import { GeolocPermissionState, useLocation } from 'libs/location'
import { LocationMode } from 'libs/location/types'
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
import { getSpacing, Typo } from 'ui/theme'

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
    hasGeolocPosition,
    placeQuery,
    setPlaceQuery,
    selectedPlace,
    setSelectedPlace,
    onSetSelectedPlace,
    onResetPlace,
    setPlace: setPlaceGlobally,
    onModalHideRef,
    permissionState,
    requestGeolocPermission,
    showGeolocPermissionModal,
    aroundPlaceRadius,
    setAroundPlaceRadius,
    aroundMeRadius,
    setAroundMeRadius,
    selectedLocationMode,
    setSelectedLocationMode,
    place,
  } = useLocation()
  const [tempLocationMode, setTempLocationMode] = useState<LocationMode>(selectedLocationMode)
  const isCurrentLocationMode = (target: LocationMode) => tempLocationMode === target

  useEffect(() => {
    if (visible) {
      setTempLocationMode(selectedLocationMode)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLocationMode, visible])

  useEffect(() => {
    if (visible) {
      onModalHideRef.current = undefined
      setPlaceQuery(place?.label ?? '')
      setSelectedPlace(place)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  const { navigate } = useNavigation<UseNavigationType>()

  const { searchState, dispatch } = useSearch()

  const [keyboardHeight, setKeyboardHeight] = useState(0)

  const theme = useTheme()

  const geolocationModeColor = isCurrentLocationMode(LocationMode.AROUND_ME)
    ? theme.colors.primary
    : theme.colors.black

  const customLocationModeColor = isCurrentLocationMode(LocationMode.AROUND_PLACE)
    ? theme.colors.primary
    : theme.colors.black

  const runGeolocationDialogs = useCallback(async () => {
    const selectGeoLocationMode = () => setSelectedLocationMode(LocationMode.AROUND_ME)
    const selectEverywhereMode = () => setSelectedLocationMode(LocationMode.EVERYWHERE)

    if (permissionState === GeolocPermissionState.NEVER_ASK_AGAIN) {
      setPlaceGlobally(null)
      selectEverywhereMode()
      dismissModal()
      onModalHideRef.current = showGeolocPermissionModal
    } else {
      await requestGeolocPermission({
        onAcceptance: selectGeoLocationMode,
        onRefusal: selectEverywhereMode,
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
      if (mode === LocationMode.AROUND_ME) {
        runGeolocationDialogs()
      } else {
        setTempLocationMode(mode)
      }
    },
    [runGeolocationDialogs, setTempLocationMode]
  )

  const onSubmit = () => {
    setSelectedLocationMode(tempLocationMode)
    if (tempLocationMode === LocationMode.AROUND_PLACE && selectedPlace) {
      setPlaceGlobally(selectedPlace)
      dispatch({
        type: 'SET_LOCATION_FILTERS',
        payload: {
          locationFilter: {
            place: selectedPlace,
            locationType: LocationMode.AROUND_PLACE,
            aroundRadius: aroundPlaceRadius,
          },
        },
      })
      analytics.logUserSetLocation('search')
      navigate(
        ...getTabNavConfig('Search', {
          ...searchState,
          locationFilter: {
            place: selectedPlace,
            locationType: LocationMode.AROUND_PLACE,
            aroundRadius: aroundPlaceRadius,
          },
        })
      )
    } else if (tempLocationMode === LocationMode.AROUND_ME) {
      setPlaceGlobally(null)
      dispatch({
        type: 'SET_LOCATION_FILTERS',
        payload: {
          locationFilter: { locationType: LocationMode.AROUND_ME, aroundRadius: aroundMeRadius },
        },
      })
      navigate(
        ...getTabNavConfig('Search', {
          ...searchState,
          locationFilter: { locationType: LocationMode.AROUND_ME, aroundRadius: aroundMeRadius },
        })
      )
    }
    dismissModal()
  }

  const onClose = () => {
    setAroundMeRadius(DEFAULT_RADIUS)
    setAroundPlaceRadius(DEFAULT_RADIUS)
    dismissModal()
  }

  const onAroundRadiusPlaceValueChange = useCallback(
    (newValues: number[]) => {
      if (visible) {
        setAroundPlaceRadius(newValues[0])
      }
    },
    [visible, setAroundPlaceRadius]
  )
  const onAroundMeRadiusValueChange = useCallback(
    (newValues: number[]) => {
      if (visible) {
        setAroundMeRadius(newValues[0])
      }
    },
    [visible, setAroundMeRadius]
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
          onPress={selectLocationMode(LocationMode.AROUND_ME)}
          icon={PositionFilled}
          color={geolocationModeColor}
          title="Utiliser ma position actuelle"
          subtitle={hasGeolocPosition ? undefined : 'Géolocalisation désactivée'}
        />
        {!!isCurrentLocationMode(LocationMode.AROUND_ME) && (
          <React.Fragment>
            <Spacer.Column numberOfSpaces={4} />
            <LocationSearchFilters
              aroundRadius={aroundMeRadius}
              onValuesChange={onAroundMeRadiusValueChange}
            />
          </React.Fragment>
        )}
        <Spacer.Column numberOfSpaces={6} />
        <Separator.Horizontal />
        <Spacer.Column numberOfSpaces={6} />
        <LocationModalButton
          onPress={selectLocationMode(LocationMode.AROUND_PLACE)}
          icon={MagnifyingGlassFilled}
          color={customLocationModeColor}
          title="Choisir une localisation"
          subtitle={LOCATION_PLACEHOLDER}
        />
        {!!isCurrentLocationMode(LocationMode.AROUND_PLACE) && (
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
                aroundRadius={aroundPlaceRadius}
                onValuesChange={onAroundRadiusPlaceValueChange}
              />
            )}
          </React.Fragment>
        )}
        <Spacer.Column numberOfSpaces={8} />
        <ButtonContainer>
          <ButtonPrimary
            wording="Valider la localisation"
            disabled={!selectedPlace && tempLocationMode !== LocationMode.AROUND_ME}
            onPress={onSubmit}
          />
        </ButtonContainer>
        <Spacer.Column numberOfSpaces={8} />
        <Separator.Horizontal />
        <Spacer.Column numberOfSpaces={4} />
        <Typo.Body>Tu peux aussi choisir un lieu culturel précis</Typo.Body>
        <Spacer.Column numberOfSpaces={1} />
        <ButtonTertiaryBlack
          wording="Trouver un lieu culturel"
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
