import React from 'react'
import styled from 'styled-components/native'

import { Coordinates } from 'api/gen'
import { VenueType } from 'features/venue/components/VenueType/VenueType'
import { GeolocPermissionState, useLocation } from 'libs/location'
import { useDistance } from 'libs/location/hooks/useDistance'
import { VenueTypeCode } from 'libs/parsers'
import { styledButton } from 'ui/components/buttons/styledButton'
import { IconWithCaption } from 'ui/components/IconWithCaption'
import { Touchable } from 'ui/components/touchable/Touchable'
import { PointerLocationNotFilled } from 'ui/svg/icons/PointerLocationNotFilled'
import { PointerLocationNotFilledDisabled } from 'ui/svg/icons/PointerLocationNotFilledDisabled'
import { getSpacing, Spacer } from 'ui/theme'

type Props = { type: VenueTypeCode | null; label: string; locationCoordinates: Coordinates }

export const VenueIconCaptions: React.FC<Props> = ({ type, label, locationCoordinates }) => {
  const { permissionState, requestGeolocPermission, showGeolocPermissionModal } = useLocation()
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
      <ActiveGeolocationButton
        onPress={onPressActiveGeolocation}
        disabled={!!distanceToLocation}
        accessibilityLabel={
          distanceToLocation ? 'Distance depuis la localisation' : 'Géolocalisation désactivée'
        }>
        {distanceToLocation ? (
          <IconWithCaption
            Icon={PointerLocationNotFilled}
            caption={distanceToLocation}
            accessibilityLabel="Distance"
            isDisabled={false}
          />
        ) : (
          <IconWithCaption
            Icon={PointerLocationNotFilledDisabled}
            caption="Géolocalisation désactivée"
            accessibilityLabel={undefined}
            isDisabled
          />
        )}
      </ActiveGeolocationButton>
      <Spacer.Row numberOfSpaces={6} />
    </Row>
  )
}

const Row = styled.View({ flexDirection: 'row', alignItems: 'flex-start' })

const Separator = styled.View(({ theme }) => ({
  width: 1,
  height: '92%',
  backgroundColor: theme.colors.greyMedium,
  marginHorizontal: getSpacing(2),
  alignSelf: 'center',
}))

const ActiveGeolocationButton = styledButton(Touchable)({
  flex: 1,
  flexDirection: 'row',
})
