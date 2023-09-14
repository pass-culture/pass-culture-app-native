import { useRoute } from '@react-navigation/native'
import React, { FunctionComponent, useCallback, useRef } from 'react'
import { ScrollView } from 'react-native'
import styled from 'styled-components/native'

import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { GTLPlaylistResponse } from 'features/venue/api/useGTLPlaylists'
import { useVenue } from 'features/venue/api/useVenue'
import { useVenueOffers } from 'features/venue/api/useVenueOffers'
import { VenueIconCaptions } from 'features/venue/components/VenueIconCaptions/VenueIconCaptions'
import { VenueMessagingApps } from 'features/venue/components/VenueMessagingApps/VenueMessagingApps'
import { VenueOffers } from 'features/venue/components/VenueOffers/VenueOffers'
import { VenueOfferTile } from 'features/venue/components/VenueOfferTile/VenueOfferTile'
import { VenuePartialAccordionDescription } from 'features/venue/components/VenuePartialAccordionDescription/VenuePartialAccordionDescription'
import { formatFullAddress } from 'libs/address/useFormatFullAddress'
import { useTransformOfferHits } from 'libs/algolia/fetchAlgolia/transformOfferHit'
import { analytics } from 'libs/analytics'
import { getPlaylistItemDimensionsFromLayout } from 'libs/contentful/dimensions'
import { WhereSection } from 'libs/geolocation/components/WhereSection'
import { formatDates, getDisplayPrice, parseType, VenueTypeCode } from 'libs/parsers'
import { highlightLinks } from 'libs/parsers/highlightLinks'
import { useCategoryHomeLabelMapping, useCategoryIdMapping } from 'libs/subcategories'
import { Offer } from 'shared/offer/types'
import { AccessibilityBlock } from 'ui/components/accessibility/AccessibilityBlock'
import { AccordionItem } from 'ui/components/AccordionItem'
import { ContactBlock } from 'ui/components/contact/ContactBlock'
import { Hero } from 'ui/components/hero/Hero'
import { PassPlaylist } from 'ui/components/PassPlaylist'
import { CustomListRenderItem } from 'ui/components/Playlist'
import { SectionWithDivider } from 'ui/components/SectionWithDivider'
import { useScrollWhenAccordionItemOpens } from 'ui/hooks/useScrollWhenAccordionOpens'
import { LocationPointer as DefaultLocationPointer } from 'ui/svg/icons/LocationPointer'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

interface Props {
  venueId: number
  onScroll: () => void
  playlists?: GTLPlaylistResponse
}

export const VenueBody: FunctionComponent<Props> = ({ venueId, onScroll, playlists }) => {
  const { data: venue } = useVenue(venueId)
  const { data: offers } = useVenueOffers(venueId)
  const scrollViewRef = useRef<ScrollView | null>(null)
  const route = useRoute<UseRouteType<'Offer'>>()
  const transformOfferHits = useTransformOfferHits()

  const {
    getPositionOnLayout: setAccessibilityAccordionPosition,
    ScrollTo: accessibilityScrollsTo,
  } = useScrollWhenAccordionItemOpens(scrollViewRef)
  const {
    getPositionOnLayout: setWithdrawalDetailsAccordionPosition,
    ScrollTo: withdrawalDetailsScrollsTo,
  } = useScrollWhenAccordionItemOpens(scrollViewRef)
  const { getPositionOnLayout: setContactAccordionPosition, ScrollTo: contactScrollsTo } =
    useScrollWhenAccordionItemOpens(scrollViewRef)
  const mapping = useCategoryIdMapping()
  const labelMapping = useCategoryHomeLabelMapping()

  const renderPassPlaylist: CustomListRenderItem<Offer> = useCallback(
    ({ item, width, height }) => {
      const hit = transformOfferHits(item)

      const timestampsInMillis = item.offer.dates?.map((timestampInSec) => timestampInSec * 1000)
      return (
        <VenueOfferTile
          categoryLabel={labelMapping[item.offer.subcategoryId]}
          categoryId={mapping[item.offer.subcategoryId]}
          subcategoryId={item.offer.subcategoryId}
          offerId={+hit.objectID}
          name={hit.offer.name}
          date={formatDates(timestampsInMillis)}
          isDuo={hit.offer.isDuo}
          thumbUrl={hit.offer.thumbUrl}
          price={getDisplayPrice(hit.offer.prices)}
          venueId={venue?.id}
          width={width}
          height={height}
          searchId={route.params?.searchId}
        />
      )
    },
    [labelMapping, mapping, route.params?.searchId, transformOfferHits, venue?.id]
  )

  if (!venue) return <React.Fragment></React.Fragment>

  const {
    address,
    postalCode,
    bannerMeta,
    bannerUrl,
    city,
    publicName,
    withdrawalDetails,
    latitude,
    longitude,
    venueTypeCode,
    description,
    accessibility,
    contact,
    name,
  } = venue
  const venueType = venueTypeCode as VenueTypeCode

  const venueAddress = formatFullAddress(address || publicName, postalCode, city)
  const typeLabel = parseType(venueType)

  const shouldShowVenueOffers = !!offers && offers?.hits.length > 0
  const shouldShowAccessibility = Object.values(accessibility).some(
    (value) => value !== undefined && value !== null
  )
  const shouldShowContact = !!contact?.email || !!contact?.phoneNumber || !!contact?.website

  return (
    <Container
      testID="venue-container"
      scrollEventThrottle={20}
      scrollIndicatorInsets={scrollIndicatorInsets}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={scrollViewRef as any}
      bounces={false}
      onScroll={onScroll}>
      <Hero imageUrl={bannerUrl ?? undefined} type="venue" venueType={venueType ?? null} />
      <Spacer.Column numberOfSpaces={4} />
      <MarginContainer>
        <VenueAddressContainer>
          <IconContainer>
            <LocationPointer accessibilityLabel="Adresse" />
          </IconContainer>
          <StyledText numberOfLines={1}>{venueAddress}</StyledText>
        </VenueAddressContainer>
        <Spacer.Column numberOfSpaces={2} />
        <VenueTitle
          accessibilityLabel={`Nom du lieu\u00a0: ${publicName || name}`}
          testID="venueTitle"
          numberOfLines={2}
          adjustsFontSizeToFit
          allowFontScaling={false}>
          {publicName || name}
        </VenueTitle>
        <Spacer.Column numberOfSpaces={4} />
      </MarginContainer>

      <VenueIconCaptions
        type={venueType ?? null}
        label={typeLabel}
        locationCoordinates={{ latitude, longitude }}
      />

      {/* Description */}
      <VenuePartialAccordionDescription
        description={description ?? undefined}
        credit={bannerMeta?.image_credit}
      />

      {/* Offres */}
      <SectionWithDivider visible={shouldShowVenueOffers}>
        <VenueOffers venueId={venueId} />
      </SectionWithDivider>

      {/* Où */}
      <SectionWithDivider visible margin>
        <WhereSection
          beforeNavigateToItinerary={() =>
            analytics.logConsultItinerary({ venueId, from: 'venue' })
          }
          venue={venue}
          address={venueAddress}
          locationCoordinates={{ latitude, longitude }}
        />
      </SectionWithDivider>

      <SectionWithDivider visible margin>
        <VenueMessagingApps venueId={venueId} />
      </SectionWithDivider>

      {/* Modalités de retrait */}
      <SectionWithDivider
        visible={!!withdrawalDetails}
        onLayout={setWithdrawalDetailsAccordionPosition}>
        <AccordionItem
          title="Modalités de retrait"
          onOpen={withdrawalDetailsScrollsTo}
          onOpenOnce={() => analytics.logConsultWithdrawal({ venueId })}>
          <Typo.Body>{withdrawalDetails && highlightLinks(withdrawalDetails)}</Typo.Body>
        </AccordionItem>
      </SectionWithDivider>

      {/* Accessibilité */}
      <SectionWithDivider
        visible={shouldShowAccessibility}
        onLayout={setAccessibilityAccordionPosition}>
        <AccordionItem
          title="Accessibilité"
          onOpen={accessibilityScrollsTo}
          onOpenOnce={() => analytics.logConsultAccessibility({ venueId })}>
          <AccessibilityBlock {...accessibility} />
        </AccordionItem>
      </SectionWithDivider>

      {/* Contact */}
      <SectionWithDivider visible={shouldShowContact} onLayout={setContactAccordionPosition}>
        <AccordionItem title="Contact" onOpen={contactScrollsTo}>
          <ContactBlock venueId={venueId} />
        </AccordionItem>
      </SectionWithDivider>

      <SectionWithDivider visible>
        <AccordionItem title="Playlists">
          {playlists?.map((playlist) => {
            const { itemWidth, itemHeight } = getPlaylistItemDimensionsFromLayout(playlist.layout)
            return (
              <PassPlaylist
                key={playlist.title}
                data={playlist.offers.hits}
                itemWidth={itemWidth}
                itemHeight={itemHeight}
                renderItem={renderPassPlaylist}
                keyExtractor={(item) => item.offer.objectID}
                title={playlist.title}
              />
            )
          }) ?? <React.Fragment />}
        </AccordionItem>
      </SectionWithDivider>

      <SectionWithDivider visible>
        <Spacer.Column numberOfSpaces={6} />
      </SectionWithDivider>
    </Container>
  )
}

const LocationPointer = styled(DefaultLocationPointer).attrs(({ theme }) => ({
  color: theme.colors.primary,
  size: theme.icons.sizes.extraSmall,
}))``

const scrollIndicatorInsets = { right: 1 }

const Container = styled.ScrollView({ overflow: 'visible' })
const VenueTitle = styled(Typo.Title3).attrs(getHeadingAttrs(1))({
  textAlign: 'center',
})

const MarginContainer = styled.View({
  marginHorizontal: getSpacing(6),
})

const VenueAddressContainer = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: getSpacing(2),
})

const IconContainer = styled.View({
  marginRight: getSpacing(1),
})

const StyledText = styled(Typo.Caption)({
  flexShrink: 1,
  textTransform: 'capitalize',
})
