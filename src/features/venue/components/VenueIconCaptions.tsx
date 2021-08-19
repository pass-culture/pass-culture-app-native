import React from 'react'
import { Linking } from 'react-native'
import styled from 'styled-components/native'

import { Coordinates, VenueTypeCode } from 'api/gen'
import { IconWithCaption } from 'features/venue/atoms/IconWithCaption'
import { GeolocPermissionState, useGeolocation } from 'libs/geolocation'
import { GeolocationActivationModal } from 'libs/geolocation/components/GeolocationActivationModal'
import { useDistance } from 'libs/geolocation/hooks/useDistance'
import { useModal } from 'ui/components/modals/useModal'
import { PointerLocationNotFilled } from 'ui/svg/icons/PointerLocationNotFilled'
import { PointerLocationNotFilledDisabled } from 'ui/svg/icons/PointerLocationNotFilledDisabled'
import { ColorsEnum, getSpacing, Spacer } from 'ui/theme'
import { ACTIVE_OPACITY } from 'ui/theme/colors'

import { VenueType } from '../atoms/VenueType'

type Props = { type: VenueTypeCode | null; label: string; locationCoordinates: Coordinates }

export const VenueIconCaptions: React.FC<Props> = ({ type, label, locationCoordinates }) => {
  const { permissionState, requestGeolocPermission } = useGeolocation()
  const { latitude: lat, longitude: lng } = locationCoordinates
  const distanceToLocation = useDistance({ lat, lng })
  const {
    visible: isGeolocPermissionModalVisible,
    showModal: showGeolocPermissionModal,
    hideModal: hideGeolocPermissionModal,
  } = useModal(false)

  const getInformationsForLocation = () => {
    return {
      testID: 'iconLocation',
      Icon: distanceToLocation ? PointerLocationNotFilled : PointerLocationNotFilledDisabled,
      caption: distanceToLocation ? distanceToLocation : 'Géolocalisation désactivée',
      isDisabled: distanceToLocation === undefined ? true : false,
    }
  }

  const onPressActiveGeolocation = async () => {
    if (permissionState === GeolocPermissionState.NEVER_ASK_AGAIN) {
      showGeolocPermissionModal()
    } else {
      await requestGeolocPermission()
    }
  }

  function onPressCustomGeolocPermissionModalButton() {
    Linking.openSettings()
    hideGeolocPermissionModal()
  }

  return (
    <React.Fragment>
      <Row>
        <Spacer.Row numberOfSpaces={6} />
        <VenueType type={type} label={label} />
        <Separator />
        <ActiveGeolocationButton onPress={onPressActiveGeolocation}>
          <IconWithCaption {...getInformationsForLocation()} />
        </ActiveGeolocationButton>
        <Spacer.Row numberOfSpaces={6} />
      </Row>
      <GeolocationActivationModal
        isGeolocPermissionModalVisible={isGeolocPermissionModalVisible}
        hideGeolocPermissionModal={hideGeolocPermissionModal}
        onPressGeolocPermissionModalButton={onPressCustomGeolocPermissionModalButton}
      />
    </React.Fragment>
  )
}

const Row = styled.View({ flexDirection: 'row', alignItems: 'flex-start' })

const Separator = styled.View({
  width: 1,
  height: '92%',
  backgroundColor: ColorsEnum.GREY_MEDIUM,
  marginHorizontal: getSpacing(2),
  alignSelf: 'center',
})

const ActiveGeolocationButton = styled.TouchableOpacity.attrs(() => ({
  activeOpacity: ACTIVE_OPACITY,
}))({
  flex: 1,
})
