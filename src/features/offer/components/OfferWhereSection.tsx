import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { Coordinates } from 'api/gen'
import { analytics } from 'libs/analytics'
import { Spacer } from 'ui/components/spacer/Spacer'
import { LocationPointer } from 'ui/svg/icons/LocationPointer'
import { Typo, ColorsEnum } from 'ui/theme'

import { useItinerary } from '../services/useItinerary'

import { useDistance } from './useDistance'

type Props = {
  address: string | null
  offerId: number
  offerCoordinates: Coordinates
}

export const OfferWhereSection: React.FC<Props> = ({ address, offerCoordinates, offerId }) => {
  const { latitude: lat, longitude: lng } = offerCoordinates
  const distanceToOffer = useDistance({ lat, lng })
  const { availableApps, navigateTo } = useItinerary()
  if (distanceToOffer === undefined && address === null) return null

  const handleOpenNavigation = () => {
    if (!lat || !lng) return
    analytics.logConsultItinerary(offerId)
    navigateTo({ latitude: lat, longitude: lng })
  }

  return (
    <React.Fragment>
      <Spacer.Column numberOfSpaces={6} />
      <Typo.Title4>{t`Où ?`}</Typo.Title4>
      {address && (
        <React.Fragment>
          <Spacer.Column numberOfSpaces={4} />
          <Typo.Caption>{t`Adresse`}</Typo.Caption>
          <Spacer.Column numberOfSpaces={1} />
          <StyledAddress>{address}</StyledAddress>
        </React.Fragment>
      )}
      {distanceToOffer && (
        <React.Fragment>
          <Spacer.Column numberOfSpaces={4} />
          <Typo.Caption>{t`Distance`}</Typo.Caption>
          <Spacer.Column numberOfSpaces={1} />
          <Typo.Body>{distanceToOffer}</Typo.Body>
        </React.Fragment>
      )}

      {lat !== undefined && lng !== undefined && availableApps !== undefined && (
        <React.Fragment>
          <Spacer.Column numberOfSpaces={4} />
          <Separator />
          <Spacer.Column numberOfSpaces={6} />
          <TouchableContainer onPress={handleOpenNavigation}>
            <LocationPointer color={ColorsEnum.BLACK} size={24} />
            <Spacer.Row numberOfSpaces={1} />
            <Typo.ButtonText>{t`Voir l'itinéraire`}</Typo.ButtonText>
          </TouchableContainer>
        </React.Fragment>
      )}
      <Spacer.Column numberOfSpaces={6} />
    </React.Fragment>
  )
}

const StyledAddress = styled(Typo.Body)({
  textTransform: 'capitalize',
})

const Separator = styled.View({
  height: 1,
  backgroundColor: ColorsEnum.GREY_MEDIUM,
})

const TouchableContainer = styled.TouchableOpacity({
  flexDirection: 'row',
  alignItems: 'center',
})
