import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { OfferVenueResponse } from 'api/gen'
import { getLocationName } from 'features/offer/helpers/getLocationName'
import { Digital as DefaultDigital } from 'ui/svg/icons/Digital'
import { LocationPointer as DefaultLocationPointer } from 'ui/svg/icons/LocationPointer'
import { getSpacing, Typo } from 'ui/theme'

type Props = {
  venue: OfferVenueResponse
  isDigital: boolean
}

export const LocationCaption: FunctionComponent<Props> = ({ venue, isDigital }: Props) => {
  const locationName = getLocationName(venue, isDigital)
  const where = isDigital ? 'en ligne' : venue.city

  return (
    <LocationContainer>
      <StyledView>
        <IconContainer>
          {isDigital ? (
            <Digital accessibilityLabel="Offre digitale" />
          ) : (
            <LocationPointer accessibilityLabel="Adresse" />
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

const Digital = styled(DefaultDigital).attrs(({ theme }) => ({
  color: theme.colors.primary,
  size: theme.icons.sizes.extraSmall,
}))``
const LocationPointer = styled(DefaultLocationPointer).attrs(({ theme }) => ({
  color: theme.colors.primary,
  size: theme.icons.sizes.extraSmall,
}))``

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
