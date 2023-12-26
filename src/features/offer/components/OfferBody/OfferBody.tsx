import React, { FunctionComponent, useRef } from 'react'
import { ScrollView } from 'react-native'
import { IOScrollView } from 'react-native-intersection-observer'
import styled from 'styled-components/native'

import { OfferResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { LocationCaption } from 'features/offer/components/LocationCaption'
import { OfferIconCaptions } from 'features/offer/components/OfferIconCaptions/OfferIconCaptions'
import { OfferMessagingApps } from 'features/offer/components/OfferMessagingApps/OfferMessagingApps'
import { OfferPartialDescription } from 'features/offer/components/OfferPartialDescription/OfferPartialDescription'
import { OfferPlace } from 'features/offer/components/OfferPlace/OfferPlace'
import { HitOfferWithArtistAndEan } from 'features/offer/components/OfferPlaylist/api/fetchOffersByArtist'
import { OfferPlaylistList } from 'features/offer/components/OfferPlaylistList/OfferPlaylistList'
import { extractStockDates } from 'features/offer/helpers/extractStockDates/extractStockDates'
import { useTrackOfferSeenDuration } from 'features/offer/helpers/useTrackOfferSeenDuration'
import { accessibilityAndTestId } from 'libs/accessibilityAndTestId'
import { analytics } from 'libs/analytics'
import { useLocation } from 'libs/location'
import { getFormattedDates, capitalizeFirstLetter } from 'libs/parsers'
import { highlightLinks } from 'libs/parsers/highlightLinks'
import { useSubcategoriesMapping } from 'libs/subcategories'
import { Offer, RecommendationApiParams } from 'shared/offer/types'
import { AccessibilityBlock } from 'ui/components/accessibility/AccessibilityBlock'
import { AccordionItem } from 'ui/components/AccordionItem'
import { Hero } from 'ui/components/hero/Hero'
import { SectionWithDivider } from 'ui/components/SectionWithDivider'
import { useScrollWhenAccordionItemOpens } from 'ui/hooks/useScrollWhenAccordionOpens'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

interface Props {
  offer: OfferResponse
  onScroll: () => void
  handleChangeSameArtistPlaylistDisplay: (inView: boolean) => void
  sameCategorySimilarOffers?: Offer[]
  apiRecoParamsSameCategory?: RecommendationApiParams
  otherCategoriesSimilarOffers?: Offer[]
  apiRecoParamsOtherCategories?: RecommendationApiParams
  sameArtistPlaylist?: HitOfferWithArtistAndEan[]
}

export const OfferBody: FunctionComponent<Props> = ({
  offer,
  onScroll,
  sameCategorySimilarOffers,
  apiRecoParamsSameCategory,
  otherCategoriesSimilarOffers,
  apiRecoParamsOtherCategories,
  sameArtistPlaylist,
  handleChangeSameArtistPlaylistDisplay,
}) => {
  const { user } = useAuthContext()
  const scrollViewRef = useRef<ScrollView | null>(null)
  const { geolocPosition } = useLocation()
  const mapping = useSubcategoriesMapping()
  const { categoryId, isEvent, appLabel: categoryLabel } = mapping[offer.subcategoryId]

  const dates = extractStockDates(offer)
  const formattedDate = getFormattedDates(dates)
  const capitalizedFormattedDateEvent = capitalizeFirstLetter(formattedDate)

  const shouldShowAccessibility = Object.values(offer.accessibility).some(
    (value) => value !== undefined && value !== null
  )

  const {
    getPositionOnLayout: setAccessibilityAccordionPosition,
    ScrollTo: accessibilityScrollsTo,
  } = useScrollWhenAccordionItemOpens(scrollViewRef)

  const {
    getPositionOnLayout: setWithdrawalDetailsAccordionPosition,
    ScrollTo: withdrawalDetailsScrollsTo,
  } = useScrollWhenAccordionItemOpens(scrollViewRef)

  useTrackOfferSeenDuration(offer.id)

  return (
    <Container
      testID="offer-container"
      scrollEventThrottle={16}
      scrollIndicatorInsets={scrollIndicatorInsets}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={scrollViewRef as any}
      bounces={false}
      onScroll={onScroll}>
      <Hero imageUrl={offer.image?.url} type="offer" categoryId={categoryId} />
      <Spacer.Column numberOfSpaces={4} />
      <LocationCaption venue={offer.venue} isDigital={offer.isDigital} />
      <Spacer.Column numberOfSpaces={2} />
      <MarginContainer>
        <OfferTitle
          numberOfLines={3}
          adjustsFontSizeToFit
          allowFontScaling={false}
          {...accessibilityAndTestId(`Nom de l’offre\u00a0: ${offer.name}`)}>
          {offer.name}
        </OfferTitle>
      </MarginContainer>
      <Spacer.Column numberOfSpaces={4} />
      <OfferIconCaptions
        isDuo={offer.isDuo}
        stocks={offer.stocks}
        categoryId={categoryId}
        label={categoryLabel}
      />
      <OfferPartialDescription description={offer.description ?? ''} id={offer.id} />
      <Spacer.Column numberOfSpaces={4} />

      <SectionWithDivider visible={!!capitalizedFormattedDateEvent} margin>
        <StyledTitle4>Quand&nbsp;?</StyledTitle4>
        <SectionBody>{capitalizedFormattedDateEvent}</SectionBody>
      </SectionWithDivider>

      <OfferPlace offer={offer} geolocPosition={geolocPosition} isEvent={isEvent} />

      <SectionWithDivider visible margin>
        <OfferMessagingApps offer={offer} />
      </SectionWithDivider>

      <SectionWithDivider
        visible={!!offer.withdrawalDetails && !!user?.isBeneficiary}
        onLayout={setWithdrawalDetailsAccordionPosition}>
        <AccordionItem
          title="Modalités de retrait"
          onOpen={withdrawalDetailsScrollsTo}
          onOpenOnce={() => analytics.logConsultWithdrawal({ offerId: offer.id })}>
          <Typo.Body>
            {offer.withdrawalDetails && highlightLinks(offer.withdrawalDetails)}
          </Typo.Body>
        </AccordionItem>
      </SectionWithDivider>

      <SectionWithDivider
        visible={shouldShowAccessibility}
        onLayout={setAccessibilityAccordionPosition}>
        <AccordionItem
          title="Accessibilité"
          onOpen={accessibilityScrollsTo}
          onOpenOnce={() => analytics.logConsultAccessibility({ offerId: offer.id })}>
          <AccessibilityBlock {...offer.accessibility} />
        </AccordionItem>
      </SectionWithDivider>

      <OfferPlaylistList
        offer={offer}
        position={geolocPosition}
        sameCategorySimilarOffers={sameCategorySimilarOffers}
        apiRecoParamsSameCategory={apiRecoParamsSameCategory}
        otherCategoriesSimilarOffers={otherCategoriesSimilarOffers}
        apiRecoParamsOtherCategories={apiRecoParamsOtherCategories}
        sameArtistPlaylist={sameArtistPlaylist}
        handleChangeSameArtistPlaylistDisplay={handleChangeSameArtistPlaylistDisplay}
      />

      <SectionWithDivider visible>
        <Spacer.Column numberOfSpaces={6} />
      </SectionWithDivider>
    </Container>
  )
}

const scrollIndicatorInsets = { right: 1 }

const Container = styled(IOScrollView)({ overflow: 'visible' })
const OfferTitle = styled(Typo.Title3).attrs(getHeadingAttrs(1))({
  textAlign: 'center',
})
const StyledTitle4 = styled(Typo.Title4).attrs(getHeadingAttrs(2))({
  paddingTop: getSpacing(6),
  paddingBottom: getSpacing(6),
})
const SectionBody = styled(Typo.Body)({
  marginTop: -getSpacing(2),
  paddingBottom: getSpacing(6),
})

const MarginContainer = styled.View({
  marginHorizontal: getSpacing(6),
})
