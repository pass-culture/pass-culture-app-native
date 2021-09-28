import React from 'react'
import styled from 'styled-components/native'

import { Coordinates, VenueTypeCode } from 'api/gen'
import { IconWithCaption } from 'features/venue/atoms/IconWithCaption'
import { VenueType } from 'features/venue/atoms/VenueType'
import { GeolocPermissionState, useGeolocation } from 'libs/geolocation'
import { useDistance } from 'libs/geolocation/hooks/useDistance'
import { accessibilityAndTestId } from 'tests/utils'
import { PointerLocationNotFilled } from 'ui/svg/icons/PointerLocationNotFilled'
import { PointerLocationNotFilledDisabled } from 'ui/svg/icons/PointerLocationNotFilledDisabled'
import { ColorsEnum, getSpacing, Spacer } from 'ui/theme'
import { ACTIVE_OPACITY } from 'ui/theme/colors'

type Props = { type: VenueTypeCode | null; label: string; locationCoordinates: Coordinates }

export const VenueIconCaptions: React.FC<Props> = ({ type, label, locationCoordinates }) => {
  const { permissionState, requestGeolocPermission, showGeolocPermissionModal } = useGeolocation()
  const { latitude: lat, longitude: lng } = locationCoordinates
  const distanceToLocation = useDistance({ lat, lng })

  const onPressActiveGeolocation = async () => {
    if (permissionState === GeolocPermissionState.NEVER_ASK_AGAIN) {
      showGeolocPermissionModal()
    } else {
      await requestGeolocPermission()
    }
  }

  return (
    <Row>
      <Spacer.Row numberOfSpaces={6} />
      <VenueType type={type} label={label} />
      <Separator />
      <ActiveGeolocationButton onPress={onPressActiveGeolocation} disabled={!!distanceToLocation}>
        {distanceToLocation ? (
          <IconWithCaption
            {...accessibilityAndTestId('iconLocation')}
            Icon={PointerLocationNotFilled}
            caption={distanceToLocation}
            isDisabled={false}
          />
        ) : (
          <IconWithCaption
            {...accessibilityAndTestId('iconLocation')}
            Icon={PointerLocationNotFilledDisabled}
            caption={'Géolocalisation désactivée'}
            isDisabled={true}
          />
        )}
      </ActiveGeolocationButton>
      <Spacer.Row numberOfSpaces={6} />
    </Row>
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
