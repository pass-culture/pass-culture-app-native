import { t } from '@lingui/macro'
import { useRoute } from '@react-navigation/native'
import React, { FunctionComponent, useRef } from 'react'
import { Animated } from 'react-native'
import styled from 'styled-components/native'

import { UseRouteType } from 'features/navigation/RootNavigator'
import { LocationCaption } from 'features/offer/atoms/LocationCaption'
import { _ } from 'libs/i18n'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'

import { AccordionItem, OfferHeader, OfferHero, OfferIconCaptions } from '../components'
import { OfferPartialDescription } from '../components/OfferPartialDescription'
import { useOffer } from '../hooks/useOffer'
import { dehumanizeId } from '../services/dehumanizeId'

const withdrawalsDetails =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do ' +
  'eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.'

const HEIGHT_END_OF_TRANSITION = getSpacing(20)
export const Offer: FunctionComponent = () => {
  const {
    params: { id },
  } = useRoute<UseRouteType<'Offer'>>()
  const { data: offerResponse } = useOffer({ offerId: dehumanizeId(id) })
  const headerScroll = useRef(new Animated.Value(0)).current

  if (!offerResponse) return <React.Fragment></React.Fragment>
  const digitalLocationName = offerResponse.venue.offerer.name
  const locationName = offerResponse.venue.publicName || offerResponse.venue.name

  const headerTransition = headerScroll.interpolate({
    inputRange: [0, HEIGHT_END_OF_TRANSITION],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  })
  return (
    <React.Fragment>
      <Container
        testID="offer-container"
        scrollEventThrottle={32}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: headerScroll } } }], {
          useNativeDriver: false,
        })}>
        <OfferHero category={offerResponse.category.name} imageUrl={offerResponse.imageUrl || ''} />
        <Spacer.Column numberOfSpaces={4} />
        {offerResponse.isDigital ? (
          <LocationCaption locationName={digitalLocationName} where={_(t`en ligne`)} isDigital />
        ) : (
          <LocationCaption
            locationName={locationName}
            where={offerResponse.venue.city}
            isDigital={false}
          />
        )}
        <Spacer.Column numberOfSpaces={2} />
        <MarginContainer>
          <OfferTitle testID="offerTitle" numberOfLines={3} adjustsFontSizeToFit>
            {offerResponse.name}
          </OfferTitle>
        </MarginContainer>
        <Spacer.Column numberOfSpaces={2} />
        <OfferIconCaptions
          isDuo={offerResponse.isDuo}
          bookableStocks={offerResponse.bookableStocks}
          category={offerResponse.category.name}
          label={offerResponse.category.label}
        />
        <Spacer.Column numberOfSpaces={6} />
        <OfferPartialDescription description={offerResponse.description || ''} />
        <Spacer.Column numberOfSpaces={4} />
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
      <OfferHeader offerName={offerResponse.name} headerTransition={headerTransition} />
    </React.Fragment>
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
