import { t } from '@lingui/macro'
import { useRoute } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { UseRouteType } from 'features/navigation/RootNavigator'
import { LocationCaption } from 'features/offer/atoms/LocationCaption'
import { AlgoliaCategory } from 'libs/algolia'
import { _ } from 'libs/i18n'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'

import { AccordionItem, OfferHeader, OfferHero, OfferIconCaptions } from '../components'
import { useOffer } from '../hooks/useOffer'
import { dehumanizeId } from '../services/dehumanizeId'

const withdrawalsDetails =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do ' +
  'eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.'

// TODO: remove once PC-5814 is done
const isCategoryAlgoliaCategoryTypeGuard = (category: string): category is AlgoliaCategory =>
  category in AlgoliaCategory

export const Offer: FunctionComponent = () => {
  const {
    params: { id },
  } = useRoute<UseRouteType<'Offer'>>()
  const { data: offerResponse } = useOffer({ offerId: dehumanizeId(id) })
  if (!offerResponse) return <React.Fragment></React.Fragment>
  const digitalLocationName = offerResponse.venue.offerer.name
  const locationName = offerResponse.venue.publicName || offerResponse.venue.name

  // TODO: category api will change in PC-5814 (refacto then)
  const categoryValue = offerResponse.category.value.split('.')[1] || offerResponse.category.value
  const category: AlgoliaCategory | null = isCategoryAlgoliaCategoryTypeGuard(categoryValue)
    ? categoryValue
    : null

  return (
    <Container testID="offer-container">
      <OfferHero category={category} imageUrl={offerResponse.imageUrl || ''} />
      <OfferHeader />
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
        category={category}
        label={offerResponse.category.label}
      />
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
