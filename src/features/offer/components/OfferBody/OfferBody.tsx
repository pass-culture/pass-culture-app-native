import { useNavigation, useRoute } from '@react-navigation/native'
import React, { FunctionComponent, useCallback, useRef } from 'react'
import { ScrollView } from 'react-native'
import { IOScrollView } from 'react-native-intersection-observer'
import styled from 'styled-components/native'

import { SubcategoryIdEnum } from 'api/gen'
import { useSearchVenueOffers } from 'api/useSearchVenuesOffer/useSearchVenueOffers'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator/types'
import { useOffer } from 'features/offer/api/useOffer'
import { LocationCaption } from 'features/offer/components/LocationCaption'
import { OfferIconCaptions } from 'features/offer/components/OfferIconCaptions/OfferIconCaptions'
import { OfferMessagingApps } from 'features/offer/components/OfferMessagingApps/OfferMessagingApps'
import { OfferPartialDescription } from 'features/offer/components/OfferPartialDescription/OfferPartialDescription'
import { OfferTile } from 'features/offer/components/OfferTile/OfferTile'
import { HitOfferWithArtistAndEan } from 'features/offer/components/SameArtistPlaylist/api/fetchOffersByArtist'
import { SameArtistPlaylist } from 'features/offer/components/SameArtistPlaylist/component/SameArtistPlaylist'
import { VenueSection } from 'features/offer/components/VenueSection/VenueSection'
import { VenueSelectionModal } from 'features/offer/components/VenueSelectionModal/VenueSelectionModal'
import { PlaylistType } from 'features/offer/enums'
import { extractStockDates } from 'features/offer/helpers/extractStockDates/extractStockDates'
import { getFormattedAddress } from 'features/offer/helpers/getFormattedAddress/getFormattedAddress'
import { getVenueSectionTitle } from 'features/offer/helpers/getVenueSectionTitle/getVenueSectionTitle'
import { useTrackOfferSeenDuration } from 'features/offer/helpers/useTrackOfferSeenDuration'
import { ANIMATION_DURATION } from 'features/venue/components/VenuePartialAccordionDescription/VenuePartialAccordionDescription'
import { accessibilityAndTestId } from 'libs/accessibilityAndTestId'
import { analytics } from 'libs/analytics'
import { getPlaylistItemDimensionsFromLayout } from 'libs/contentful/dimensions'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useLocation } from 'libs/geolocation'
import { WhereSection } from 'libs/geolocation/components/WhereSection'
import { useIsFalseWithDelay } from 'libs/hooks/useIsFalseWithDelay'
import {
  capitalizeFirstLetter,
  formatDates,
  formatDistance,
  getDisplayPrice,
  getFormattedDates,
} from 'libs/parsers'
import { highlightLinks } from 'libs/parsers/highlightLinks'
import {
  useCategoryHomeLabelMapping,
  useCategoryIdMapping,
  useSubcategoriesMapping,
} from 'libs/subcategories'
import { IntersectionObserver } from 'shared/IntersectionObserver/IntersectionObserver'
import { Offer, RecommendationApiParams } from 'shared/offer/types'
import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'
import { AccessibilityBlock } from 'ui/components/accessibility/AccessibilityBlock'
import { AccordionItem } from 'ui/components/AccordionItem'
import { ButtonSecondary } from 'ui/components/buttons/ButtonSecondary'
import { Hero } from 'ui/components/hero/Hero'
import { useModal } from 'ui/components/modals/useModal'
import { PassPlaylist } from 'ui/components/PassPlaylist'
import { SectionWithDivider } from 'ui/components/SectionWithDivider'
import { useScrollWhenAccordionItemOpens } from 'ui/hooks/useScrollWhenAccordionOpens'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

interface Props {
  offerId: number
  onScroll: () => void
  handleChangeSameArtistPlaylistDisplay: (inView: boolean) => void
  sameCategorySimilarOffers?: Offer[]
  apiRecoParamsSameCategory?: RecommendationApiParams
  otherCategoriesSimilarOffers?: Offer[]
  apiRecoParamsOtherCategories?: RecommendationApiParams
  sameArtistPlaylist?: HitOfferWithArtistAndEan[]
}

const keyExtractor = (item: Offer) => item.objectID

function isArrayNotEmpty<T>(data: T[] | undefined): data is T[] {
  return Boolean(data?.length)
}

export const OfferBody: FunctionComponent<Props> = ({
  offerId,
  onScroll,
  sameCategorySimilarOffers,
  apiRecoParamsSameCategory,
  otherCategoriesSimilarOffers,
  apiRecoParamsOtherCategories,
  sameArtistPlaylist,
  handleChangeSameArtistPlaylistDisplay,
}) => {
  const { navigate } = useNavigation<UseNavigationType>()
  const route = useRoute<UseRouteType<'Offer'>>()
  const { data: offer } = useOffer({ offerId })
  const { user } = useAuthContext()
  const scrollViewRef = useRef<ScrollView | null>(null)
  const mapping = useSubcategoriesMapping()
  const enableMultivenueOffer = useFeatureFlag(RemoteStoreFeatureFlags.WIP_ENABLE_MULTIVENUE_OFFER)
  const enableSameArtistPlaylist = useFeatureFlag(RemoteStoreFeatureFlags.WIP_SAME_ARTIST_PLAYLIST)
  const shouldDisplaySameArtistPlaylist =
    !!isArrayNotEmpty(sameArtistPlaylist) && enableSameArtistPlaylist
  const isMultivenueCompatibleOffer = Boolean(
    offer?.subcategoryId === SubcategoryIdEnum.LIVRE_PAPIER ||
      offer?.subcategoryId === SubcategoryIdEnum.LIVRE_AUDIO_PHYSIQUE
  )
  const { userPosition: position } = useLocation()
  const shouldFetchSearchVenueOffers = Boolean(
    enableMultivenueOffer && isMultivenueCompatibleOffer && offer?.extraData?.ean
  )
  const {
    hasNextPage,
    fetchNextPage,
    refetch,
    data,
    venueList,
    isFetching,
    nbVenueItems,
    nbLoadedHits,
    nbHits,
    isFetchingNextPage,
  } = useSearchVenueOffers({
    offerId,
    venueId: offer?.venue?.id,
    geolocation: position ?? {
      latitude: offer?.venue?.coordinates?.latitude ?? 0,
      longitude: offer?.venue?.coordinates?.longitude ?? 0,
    },
    query: offer?.extraData?.ean ?? '',
    queryOptions: { enabled: shouldFetchSearchVenueOffers },
  })

  const shouldDisplayOtherVenuesAvailableButton = Boolean(
    shouldFetchSearchVenueOffers && nbVenueItems > 0
  )

  const {
    getPositionOnLayout: setAccessibilityAccordionPosition,
    ScrollTo: accessibilityScrollsTo,
  } = useScrollWhenAccordionItemOpens(scrollViewRef)

  const {
    getPositionOnLayout: setWithdrawalDetailsAccordionPosition,
    ScrollTo: withdrawalDetailsScrollsTo,
  } = useScrollWhenAccordionItemOpens(scrollViewRef)

  useTrackOfferSeenDuration(offerId)

  const categoryMapping = useCategoryIdMapping()
  const labelMapping = useCategoryHomeLabelMapping()

  const { onScroll: onScrollModal } = useOpacityTransition()

  const fromOfferId = route.params?.fromOfferId

  const trackingOnHorizontalScroll = useCallback(() => {
    return analytics.logPlaylistHorizontalScroll(fromOfferId)
  }, [fromOfferId])

  const { itemWidth, itemHeight } = getPlaylistItemDimensionsFromLayout('two-items')

  const renderItem = useCallback(
    (
      {
        item,
        width,
        height,
        playlistType,
      }: {
        item: Offer
        width: number
        height: number
        playlistType?: PlaylistType
      },
      apiRecoParams?: RecommendationApiParams
    ) => {
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
          fromOfferId={offerId}
          playlistType={playlistType}
          apiRecoParams={apiRecoParams}
        />
      )
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [position, labelMapping, categoryMapping, offerId]
  )

  const {
    visible: isChangeVenueModalVisible,
    showModal: showChangeVenueModal,
    hideModal: hideChangeVenueModal,
  } = useModal(false)

  const onNewOfferVenueSelected = useCallback(
    (nextOfferId: number) => {
      hideChangeVenueModal()
      analytics.logConsultOffer({
        offerId: nextOfferId,
        from: 'offer',
        fromMultivenueOfferId: offerId,
      })
      navigate('Offer', {
        fromOfferId: offerId,
        id: nextOfferId,
        fromMultivenueOfferId: offerId,
      })
    },
    [hideChangeVenueModal, navigate, offerId]
  )

  const handleBeforeNavigateToItinerary = useCallback(() => {
    analytics.logConsultItinerary({ offerId, from: 'offer' })
  }, [offerId])

  const onEndReached = useCallback(() => {
    if (data && hasNextPage) {
      void fetchNextPage()
    }
  }, [data, fetchNextPage, hasNextPage])

  const onShowChangeVenueModal = useCallback(() => {
    showChangeVenueModal()
    analytics.logMultivenueOptionDisplayed(offerId)
  }, [offerId, showChangeVenueModal])

  const isRefreshing = useIsFalseWithDelay(isFetching, ANIMATION_DURATION)

  if (!offer) return null
  const { accessibility, venue } = offer
  const { categoryId, isEvent, appLabel } = mapping[offer.subcategoryId] ?? {}

  const showVenueBanner = venue.isPermanent === true
  const fullAddress = getFormattedAddress(venue, showVenueBanner)

  const dates = extractStockDates(offer)
  const formattedDate = getFormattedDates(dates)
  const capitalizedFormattedDate = capitalizeFirstLetter(formattedDate)

  const shouldDisplayWhenBlock = isEvent && !!formattedDate
  const shouldShowAccessibility = Object.values(accessibility).some(
    (value) => value !== undefined && value !== null
  )

  const venueSectionTitle = getVenueSectionTitle(offer.subcategoryId, isEvent)

  return (
    <Container
      testID="offer-container"
      scrollEventThrottle={16}
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
        categoryId={categoryId || null}
        label={appLabel}
      />
      <OfferPartialDescription description={offer.description ?? ''} id={offerId} />
      <Spacer.Column numberOfSpaces={4} />

      <SectionWithDivider visible={shouldDisplayWhenBlock} margin>
        <StyledTitle4>Quand&nbsp;?</StyledTitle4>
        <SectionBody>{capitalizedFormattedDate}</SectionBody>
      </SectionWithDivider>

      <SectionWithDivider visible={!offer.isDigital} margin>
        {enableMultivenueOffer ? (
          <VenueSection
            beforeNavigateToItinerary={handleBeforeNavigateToItinerary}
            venue={venue}
            showVenueBanner={showVenueBanner}
            title={venueSectionTitle}
          />
        ) : (
          <WhereSection
            beforeNavigateToItinerary={handleBeforeNavigateToItinerary}
            venue={venue}
            address={fullAddress}
            locationCoordinates={venue.coordinates}
            showVenueBanner={showVenueBanner}
          />
        )}

        {shouldDisplayOtherVenuesAvailableButton ? (
          <React.Fragment>
            <Spacer.Column numberOfSpaces={2} />
            <ButtonSecondary
              wording="Voir d’autres lieux disponibles"
              fullWidth
              onPress={onShowChangeVenueModal}
            />
            <Spacer.Column numberOfSpaces={6} />
          </React.Fragment>
        ) : (
          <React.Fragment />
        )}
      </SectionWithDivider>

      <SectionWithDivider visible margin>
        <OfferMessagingApps offerId={offerId} />
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
          <AccessibilityBlock {...accessibility} />
        </AccordionItem>
      </SectionWithDivider>

      {shouldDisplaySameArtistPlaylist ? (
        <IntersectionObserver onChange={handleChangeSameArtistPlaylistDisplay} threshold="50%">
          <SameArtistPlaylist
            key={offer.id}
            items={sameArtistPlaylist}
            itemWidth={itemWidth}
            itemHeight={itemHeight}
            renderItem={renderItem}
          />
        </IntersectionObserver>
      ) : null}

      {!!isArrayNotEmpty(sameCategorySimilarOffers) && (
        <SectionWithDivider testID="sameCategorySimilarOffers" visible>
          <Spacer.Column numberOfSpaces={6} />
          <PassPlaylist
            data={sameCategorySimilarOffers}
            itemWidth={itemWidth}
            itemHeight={itemHeight}
            renderItem={({ item, width, height, playlistType }) =>
              renderItem({ item, width, height, playlistType }, apiRecoParamsSameCategory)
            }
            keyExtractor={keyExtractor}
            title="Dans la même catégorie"
            onEndReached={trackingOnHorizontalScroll}
            playlistType={PlaylistType.SAME_CATEGORY_SIMILAR_OFFERS}
          />
        </SectionWithDivider>
      )}

      {!!isArrayNotEmpty(otherCategoriesSimilarOffers) && (
        <SectionWithDivider testID="otherCategoriesSimilarOffers" visible>
          <Spacer.Column numberOfSpaces={6} />
          <PassPlaylist
            data={otherCategoriesSimilarOffers}
            itemWidth={itemWidth}
            itemHeight={itemHeight}
            renderItem={({ item, width, height, playlistType }) =>
              renderItem({ item, width, height, playlistType }, apiRecoParamsOtherCategories)
            }
            keyExtractor={keyExtractor}
            title="Ça peut aussi te plaire"
            onEndReached={trackingOnHorizontalScroll}
            playlistType={PlaylistType.OTHER_CATEGORIES_SIMILAR_OFFERS}
          />
        </SectionWithDivider>
      )}

      <SectionWithDivider visible>
        <Spacer.Column numberOfSpaces={6} />
      </SectionWithDivider>

      {shouldDisplayOtherVenuesAvailableButton ? (
        <VenueSelectionModal
          isVisible={isChangeVenueModalVisible}
          items={venueList}
          title={venueSectionTitle}
          onSubmit={onNewOfferVenueSelected}
          onClosePress={hideChangeVenueModal}
          onEndReached={onEndReached}
          refreshing={isRefreshing}
          onRefresh={refetch}
          onScroll={onScrollModal}
          nbLoadedHits={nbLoadedHits}
          nbHits={nbHits}
          isFetchingNextPage={isFetchingNextPage}
          isSharingLocation={Boolean(position !== null)}
          venueName={offer.venue.publicName || offer.venue.name}
        />
      ) : null}
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
