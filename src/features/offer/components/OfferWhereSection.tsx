import { t } from '@lingui/macro'
import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { _ } from 'libs/i18n'
import { LocationPointer } from 'ui/svg/icons/LocationPointer'
import { Typo, getSpacing, ColorsEnum } from 'ui/theme'

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
  if (!distanceToOffer && !address) return null
  return (
    <Section>
      <Typo.Title4>{_(t`Où ?`)}</Typo.Title4>
      {address && (
        <View>
          <StyledCaption>{_(t`Adresse`)}</StyledCaption>
          <StyledAddress>{address}</StyledAddress>
        </View>
      )}
      {distanceToOffer && (
        <View>
          <StyledCaption>{_(t`Distance`)}</StyledCaption>
          <StyledDistance>{distanceToOffer}</StyledDistance>
        </View>
      )}
      <Separator />
      <StyledView>
        <LocationPointer color={ColorsEnum.BLACK} size={24} />
        <StyledText>{_(t`Voir l'itinéraire`)}</StyledText>
      </StyledView>
    </Section>
  )
}

const Section = styled.View({
  padding: getSpacing(6),
})

const StyledAddress = styled(Typo.Body)({
  textTransform: 'capitalize',
  paddingTop: getSpacing(1),
})

const StyledDistance = styled(Typo.Body)({
  paddingTop: getSpacing(1),
})

const StyledCaption = styled(Typo.Caption)({
  paddingTop: getSpacing(4),
})

const Separator = styled.View({
  height: 1,
  backgroundColor: ColorsEnum.GREY_MEDIUM,
  marginTop: getSpacing(4),
})

const StyledView = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  paddingTop: getSpacing(6),
})

const StyledText = styled(Typo.ButtonText)({
  paddingLeft: getSpacing(1),
})
