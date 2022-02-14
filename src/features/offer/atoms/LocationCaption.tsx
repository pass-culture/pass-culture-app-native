import { t } from '@lingui/macro'
import React, { FunctionComponent } from 'react'
import webStyled from 'styled-components'
import styled from 'styled-components/native'

import { OfferVenueResponse } from 'api/gen'
import { Digital as DefaultDigital } from 'ui/svg/icons/Digital'
import { LocationPointer as DefaultLocationPointer } from 'ui/svg/icons/LocationPointer'
import { getSpacing } from 'ui/theme'
import { Dd } from 'ui/web/list/Dd'
import { Dt } from 'ui/web/list/Dt'
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
            <Digital accessibilityLabel={t`Offre digitale`} />
          ) : (
            <LocationPointer accessibilityLabel={t`Adresse`} />
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

const IconContainer = webStyled(Dt)({
  marginRight: getSpacing(1),
})

const StyledText = webStyled(Dd)(({ theme }) => ({
  ...theme.typography.caption,
  flexShrink: 1,
  textTransform: 'capitalize',
}))

const WhereText = webStyled(Dd)<{ isDigital: boolean }>(({ isDigital, theme }) => ({
  ...theme.typography.caption,
  textTransform: isDigital ? 'none' : 'capitalize',
}))

const StyledView = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
})
