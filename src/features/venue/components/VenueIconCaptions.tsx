import React from 'react'
import styled from 'styled-components/native'

import { Coordinates, VenueTypeCode } from 'api/gen'
import { IconWithCaption } from 'features/venue/atoms/IconWithCaption'
import { useDistance } from 'libs/geolocation/hooks/useDistance'
import { PointerLocationNotFilled } from 'ui/svg/icons/PointerLocationNotFilled'
import { PointerLocationNotFilledDisabled } from 'ui/svg/icons/PointerLocationNotFilledDisabled'
import { ColorsEnum, getSpacing, Spacer } from 'ui/theme'

import { VenueType } from '../atoms/VenueType'

type Props = { type: VenueTypeCode | null; label: string; locationCoordinates: Coordinates }

export const VenueIconCaptions: React.FC<Props> = ({ type, label, locationCoordinates }) => {
  const { latitude: lat, longitude: lng } = locationCoordinates
  const distanceToLocation = useDistance({ lat, lng })

  return (
    <Row>
      <Spacer.Row numberOfSpaces={6} />
      <VenueType type={type} label={label} />
      <Separator />
      {distanceToLocation ? (
        <IconWithCaption
          testID="iconLocation"
          Icon={PointerLocationNotFilled}
          caption={distanceToLocation}
        />
      ) : (
        <IconWithCaption
          testID="iconLocation"
          Icon={PointerLocationNotFilledDisabled}
          caption="Géolocalisation désactivée"
        />
      )}
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
