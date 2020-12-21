import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { _ } from 'libs/i18n'
import { Spacer } from 'ui/components/spacer/Spacer'
import { LocationPointer } from 'ui/svg/icons/LocationPointer'
import { Typo, ColorsEnum } from 'ui/theme'

import { useItinerary } from '../services/useItinerary'

import { useDistance } from './useDistance'

type Props = {
  address: string | null
  offerPosition: {
    lat?: number
    lng?: number
  }
}

export const OfferWhereSection: React.FC<Props> = ({ address, offerPosition }) => {
  const distanceToOffer = useDistance(offerPosition)
  const { availableApps, navigateTo } = useItinerary()
  if (distanceToOffer === undefined && address === null) return null
  return (
    <React.Fragment>
      <Spacer.Column numberOfSpaces={6} />
      <Typo.Title4>{_(t`Où ?`)}</Typo.Title4>
      {address && (
        <React.Fragment>
          <Spacer.Column numberOfSpaces={4} />
          <Typo.Caption>{_(t`Adresse`)}</Typo.Caption>
          <Spacer.Column numberOfSpaces={1} />
          <StyledAddress>{address}</StyledAddress>
        </React.Fragment>
      )}
      {distanceToOffer && (
        <React.Fragment>
          <Spacer.Column numberOfSpaces={4} />
          <Typo.Caption>{_(t`Distance`)}</Typo.Caption>
          <Spacer.Column numberOfSpaces={1} />
          <Typo.Body>{distanceToOffer}</Typo.Body>
        </React.Fragment>
      )}

      {offerPosition.lat !== undefined &&
        offerPosition.lng !== undefined &&
        availableApps !== undefined && (
          <React.Fragment>
            <Spacer.Column numberOfSpaces={4} />
            <Separator />
            <Spacer.Column numberOfSpaces={6} />
            <TouchableContainer
              onPress={() => {
                if (!offerPosition.lat || !offerPosition.lng) return
                navigateTo({ latitude: offerPosition.lat, longitude: offerPosition.lng })
              }}>
              <LocationPointer color={ColorsEnum.BLACK} size={24} />
              <Spacer.Row numberOfSpaces={1} />
              <Typo.ButtonText>{_(t`Voir l'itinéraire`)}</Typo.ButtonText>
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
