import { t } from '@lingui/macro'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { OfferVenueResponse } from 'api/gen'
import { Digital } from 'ui/svg/icons/Digital'
import { LocationPointer } from 'ui/svg/icons/LocationPointer'
import { ColorsEnum, getSpacing, Typo } from 'ui/theme'

type Props = {
  venue: OfferVenueResponse
  isDigital: boolean
}

export const getLocationName = (venue: OfferVenueResponse, isDigital: boolean): string =>
  isDigital ? venue.offerer.name : venue.publicName || venue.name

export const LocationCaption: FunctionComponent<Props> = ({ venue, isDigital }: Props) => {
  const locationName = getLocationName(venue, isDigital)
  const where = isDigital ? t`en ligne` : venue.city

  return (
    <LocationContainer>
      <StyledView>
        <IconContainer>
          {isDigital ? (
            <Digital size={getSpacing(4.5)} color={ColorsEnum.PRIMARY} />
          ) : (
            <LocationPointer size={getSpacing(4.5)} color={ColorsEnum.PRIMARY} />
          )}
        </IconContainer>
        {!!locationName && <StyledText numberOfLines={1}>{`${locationName}, `}</StyledText>}
      </StyledView>
      {!!where && (
        <WhereText numberOfLines={1} isDigital={isDigital}>
          {where}
        </WhereText>
      )}
    </LocationContainer>
  )
}

const LocationContainer = styled.View({
  justifyContent: 'center',
  alignItems: 'center',
  flexWrap: 'wrap',
  flexDirection: 'row',
  marginHorizontal: getSpacing(6),
})

const IconContainer = styled.View({
  marginRight: getSpacing(1),
})

const StyledText = styled(Typo.Caption)({
  flexShrink: 1,
  textTransform: 'capitalize',
})

const WhereText = styled(Typo.Caption)<{ isDigital: boolean }>(({ isDigital }) => ({
  textTransform: isDigital ? 'none' : 'capitalize',
}))

const StyledView = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
})
