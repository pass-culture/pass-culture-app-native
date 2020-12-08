import { t } from '@lingui/macro'
import { StackScreenProps } from '@react-navigation/stack'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { RootStackParamList } from 'features/navigation/RootNavigator'
import { LocationCaption } from 'features/offer/atoms/LocationCaption'
import { _ } from 'libs/i18n'
import { getSpacing, Spacer, Typo } from 'ui/theme'

import { OfferHeader } from '../components/OfferHeader'
import { OfferHero } from '../components/OfferHero'
import { OfferIconCaptions } from '../components/OfferIconCaptions'

type Props = StackScreenProps<RootStackParamList, 'Offer'>

export const Offer: FunctionComponent<Props> = ({ route }: Props) => {
  const { algoliaHit } = route.params
  const locationName = algoliaHit?.venue.publicName || algoliaHit?.venue.name
  const digitalLocationName = algoliaHit?.offerer.name

  return (
    <Container>
      <OfferHero imageUrl={algoliaHit?.offer.thumbUrl || ''} />
      <OfferHeader />
      <Spacer.Column numberOfSpaces={8} />
      {algoliaHit?.offer.isDigital ? (
        <LocationCaption locationName={digitalLocationName} where={_(t`en ligne`)} isDigital />
      ) : (
        <LocationCaption
          locationName={locationName}
          where={algoliaHit?.venue.city}
          isDigital={false}
        />
      )}
      <Spacer.Column numberOfSpaces={2} />
      <MarginContainer>
        <Title testID="offerTitle" numberOfLines={3} adjustsFontSizeToFit>
          {algoliaHit?.offer.name}
        </Title>
      </MarginContainer>
      <Spacer.Column numberOfSpaces={2} />
      <OfferIconCaptions algoliaHit={algoliaHit} />
      <Spacer.Flex />
    </Container>
  )
}

const Container = styled.ScrollView({})
const Title = styled(Typo.Title3)({ textAlign: 'center' })

const MarginContainer = styled.View({
  marginHorizontal: getSpacing(6),
})
