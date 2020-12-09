import { t } from '@lingui/macro'
import { StackScreenProps } from '@react-navigation/stack'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { RootStackParamList } from 'features/navigation/RootNavigator'
import { LocationCaption } from 'features/offer/atoms/LocationCaption'
import { _ } from 'libs/i18n'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'

import { AccordionItem, OfferHeader, OfferHero, OfferIconCaptions } from '../components'

type Props = StackScreenProps<RootStackParamList, 'Offer'>

const withdrawalsDetails =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do ' +
  'eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.'

export const Offer: FunctionComponent<Props> = ({ route }: Props) => {
  const { algoliaHit } = route.params
  const locationName = algoliaHit?.venue.publicName || algoliaHit?.venue.name
  const digitalLocationName = algoliaHit?.offerer.name

  return (
    <Container>
      <OfferHero
        category={algoliaHit?.offer.category}
        imageUrl={algoliaHit?.offer.thumbUrl || ''}
      />
      <OfferHeader />
      <Spacer.Column numberOfSpaces={4} />
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
        <OfferTitle testID="offerTitle" numberOfLines={3} adjustsFontSizeToFit>
          {algoliaHit?.offer.name}
        </OfferTitle>
      </MarginContainer>
      <Spacer.Column numberOfSpaces={2} />
      <OfferIconCaptions algoliaHit={algoliaHit} />
      <Spacer.Column numberOfSpaces={2} />
      <Divider />
      <SectionTitle>{_(t`Où ?`)}</SectionTitle>
      <Divider />
      <SectionTitle>{_(t`Quand ?`)}</SectionTitle>
      <Divider />
      <AccordionItem title={_(t`Modalités de retrait`)}>
        <Typo.Body>{withdrawalsDetails}</Typo.Body>
      </AccordionItem>
      <Spacer.Flex />
    </Container>
  )
}

const Container = styled.ScrollView({})
const OfferTitle = styled(Typo.Title3)({ textAlign: 'center' })
const SectionTitle = styled(Typo.Title4)({ padding: getSpacing(6) })

const MarginContainer = styled.View({
  marginHorizontal: getSpacing(6),
})

const Divider = styled.View({
  height: getSpacing(2),
  backgroundColor: ColorsEnum.GREY_LIGHT,
})
