import React, { FunctionComponent, useCallback, useRef, useState } from 'react'
import { ScrollView } from 'react-native'
import styled from 'styled-components/native'

import { ReportedOffer } from 'api/gen'
import { getPlaylistItemDimensionsFromLayout } from 'features/home/contentful/dimensions'
import { useOffer } from 'features/offer/api/useOffer'
import { useReportedOffers } from 'features/offer/api/useReportedOffers'
import { useSimilarOffers } from 'features/offer/api/useSimilarOffers'
import { LocationCaption } from 'features/offer/components/LocationCaption'
import { OfferIconCaptions } from 'features/offer/components/OfferIconCaptions/OfferIconCaptions'
import { OfferPartialDescription } from 'features/offer/components/OfferPartialDescription/OfferPartialDescription'
import { OfferTile } from 'features/offer/components/OfferTile/OfferTile'
import { ReportOfferModal } from 'features/offer/components/ReportOfferModal/ReportOfferModal'
import { useTrackOfferSeenDuration } from 'features/offer/helpers/useTrackOfferSeenDuration'
import { useUserProfileInfo } from 'features/profile/api'
import { isUserBeneficiary, isUserExBeneficiary } from 'features/profile/utils'
import {
  formatFullAddress,
  formatFullAddressWithVenueName,
} from 'libs/address/useFormatFullAddress'
import { analytics } from 'libs/firebase/analytics'
import { useGeolocation } from 'libs/geolocation'
import { WhereSection } from 'libs/geolocation/components/WhereSection'
import { formatDatePeriod, formatDates, formatDistance, getDisplayPrice } from 'libs/parsers'
import { highlightLinks } from 'libs/parsers/highlightLinks'
import { SearchHit } from 'libs/search'
import {
  useCategoryHomeLabelMapping,
  useCategoryIdMapping,
  useSubcategoriesMapping,
} from 'libs/subcategories'
import { AccessibilityBlock } from 'ui/components/accessibility/AccessibilityBlock'
import { AccordionItem } from 'ui/components/AccordionItem'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { Hero } from 'ui/components/hero/Hero'
import { PassPlaylist } from 'ui/components/PassPlaylist'
import { CustomListRenderItem } from 'ui/components/Playlist'
import { SectionWithDivider } from 'ui/components/SectionWithDivider'
import { Flag as DefaultFlag } from 'ui/svg/icons/Flag'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

interface Props {
  offerId: number
  onScroll: () => void
}

export const OfferBody: FunctionComponent<Props> = ({ offerId, onScroll }) => {
  const { data: offer } = useOffer({ offerId })
  const { data: user } = useUserProfileInfo()
  const scrollViewRef = useRef<ScrollView | null>(null)
  const mapping = useSubcategoriesMapping()

  const [isReportOfferModalVisible, setIsReportOfferModalVisible] = useState(false)
  const showReportOfferDescription = () => setIsReportOfferModalVisible(true)
  const hideReportOfferDescription = () => setIsReportOfferModalVisible(false)

  useTrackOfferSeenDuration(offerId)

  const categoryMapping = useCategoryIdMapping()
  const labelMapping = useCategoryHomeLabelMapping()
  const { position } = useGeolocation()
  const similarOffers = useSimilarOffers(offerId)

  const { itemWidth, itemHeight } = getPlaylistItemDimensionsFromLayout('two-items')

  const renderItem: CustomListRenderItem<SearchHit> = useCallback(
    ({ item, width, height }) => {
      const timestampsInMillis = item.offer.dates?.map((timestampInSec) => timestampInSec * 1000)
      return (
        <OfferTile
          categoryLabel={labelMapping[item.offer.subcategoryId]}
          categoryId={categoryMapping[item.offer.subcategoryId]}
          subcategoryId={item.offer.subcategoryId}
          offerId={+item.objectID}
          distance={formatDistance(item._geoloc, position)}
          name={item.offer.name}
          date={formatDates(timestampsInMillis)}
          isDuo={item.offer.isDuo}
          thumbUrl={item.offer.thumbUrl}
          price={getDisplayPrice(item.offer.prices)}
          width={width}
          height={height}
          analyticsFrom="offer"
        />
      )
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [position, labelMapping, categoryMapping]
  )

  const { data: reportedOffersResponse } = useReportedOffers()
  const isOfferAlreadyReported = reportedOffersResponse?.reportedOffers?.find(
    (reportedOffer: ReportedOffer) => reportedOffer.offerId === offerId
  )

  if (!offer) return <React.Fragment></React.Fragment>
  const { accessibility, venue } = offer
  const { categoryId, isEvent, appLabel } = mapping[offer.subcategoryId]

  const showVenueBanner = venue.isPermanent === true
  const fullAddress = showVenueBanner
    ? formatFullAddress(venue.address, venue.postalCode, venue.city)
    : formatFullAddressWithVenueName(
        venue.address,
        venue.postalCode,
        venue.city,
        venue.publicName,
        venue.name
      )

  const dates = offer.stocks.reduce<string[]>(
    (accumulator, stock) =>
      stock.beginningDatetime ? [...accumulator, stock.beginningDatetime] : accumulator,
    []
  )

  const formattedDate = formatDatePeriod(dates)
  const shouldDisplayWhenBlock = isEvent && !!formattedDate
  const shouldShowAccessibility = Object.values(accessibility).some(
    (value) => value !== undefined && value !== null
  )

  return (
    <Container
      testID="offer-container"
      scrollEventThrottle={20}
      scrollIndicatorInsets={scrollIndicatorInsets}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={scrollViewRef as any}
      bounces={false}
      onScroll={onScroll}>
      <Hero imageUrl={offer.image?.url} type="offer" categoryId={categoryId || null} />
      <Spacer.Column numberOfSpaces={4} />
      <LocationCaption venue={venue} isDigital={offer.isDigital} />
      <Spacer.Column numberOfSpaces={2} />
      <MarginContainer>
        <OfferTitle
          testID="offerTitle"
          numberOfLines={3}
          adjustsFontSizeToFit
          allowFontScaling={false}
          accessibilityLabel={`Nom de l'offre\u00a0: ${offer.name}`}>
          {offer.name}
        </OfferTitle>
      </MarginContainer>
      <Spacer.Column numberOfSpaces={4} />
      <OfferIconCaptions
        isDuo={offer.isDuo}
        stocks={offer.stocks}
        categoryId={categoryId || null}
        label={appLabel}
      />
      <OfferPartialDescription description={offer.description || ''} id={offerId} />
      <Spacer.Column numberOfSpaces={4} />

      <SectionWithDivider visible={shouldDisplayWhenBlock} margin>
        <StyledTitle4>Quand&nbsp;?</StyledTitle4>
        <SectionBody>{formattedDate}</SectionBody>
      </SectionWithDivider>

      <SectionWithDivider visible={!offer.isDigital} margin>
        <WhereSection
          beforeNavigateToItinerary={() =>
            analytics.logConsultItinerary({ offerId: offer.id, from: 'offer' })
          }
          venue={venue}
          address={fullAddress}
          locationCoordinates={venue.coordinates}
          showVenueBanner={showVenueBanner}
        />
      </SectionWithDivider>

      <SectionWithDivider visible={!!offer.withdrawalDetails && !!user?.isBeneficiary}>
        <AccordionItem
          title="Modalités de retrait"
          scrollViewRef={scrollViewRef}
          onOpenOnce={() => analytics.logConsultWithdrawal({ offerId: offer.id })}>
          <Typo.Body>
            {offer.withdrawalDetails && highlightLinks(offer.withdrawalDetails)}
          </Typo.Body>
        </AccordionItem>
      </SectionWithDivider>

      <SectionWithDivider visible={shouldShowAccessibility}>
        <AccordionItem
          title="Accessibilité"
          scrollViewRef={scrollViewRef}
          onOpenOnce={() => analytics.logConsultAccessibility({ offerId: offer.id })}>
          <AccessibilityBlock {...accessibility} />
        </AccordionItem>
      </SectionWithDivider>

      <SectionWithDivider
        visible={!!user && (isUserBeneficiary(user) || isUserExBeneficiary(user))}
        margin>
        <SectionReportOffer>
          <ButtonTertiaryBlack
            inline
            wording={isOfferAlreadyReported ? 'Tu as déjà signalé cette offre' : 'Signaler l’offre'}
            disabled={!!isOfferAlreadyReported}
            icon={() => <Flag />}
            onPress={showReportOfferDescription}
            justifyContent="flex-start"
          />
        </SectionReportOffer>
      </SectionWithDivider>

      <ReportOfferModal
        isVisible={isReportOfferModalVisible}
        dismissModal={hideReportOfferDescription}
        offerId={offerId}
      />

      {similarOffers ? (
        <SectionWithDivider visible>
          <Spacer.Column numberOfSpaces={6} />
          <PassPlaylist
            data={similarOffers}
            itemWidth={itemWidth}
            itemHeight={itemHeight}
            renderItem={renderItem}
            keyExtractor={(item) => item.objectID}
            title="Ça peut aussi te plaire "
          />
        </SectionWithDivider>
      ) : null}

      <SectionWithDivider visible>
        <Spacer.Column numberOfSpaces={6} />
      </SectionWithDivider>
    </Container>
  )
}

const scrollIndicatorInsets = { right: 1 }

const Container = styled.ScrollView({ overflow: 'visible' })
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
const SectionReportOffer = styled.View({
  paddingVertical: getSpacing(5),
  alignItems: 'flex-start',
})

const MarginContainer = styled.View({
  marginHorizontal: getSpacing(6),
})

const Flag = styled(DefaultFlag).attrs(({ theme }) => ({
  size: theme.icons.sizes.smaller,
}))``
