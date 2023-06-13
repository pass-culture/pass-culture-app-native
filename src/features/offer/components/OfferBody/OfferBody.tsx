import { useNavigation, useRoute } from '@react-navigation/native'
import React, { FunctionComponent, useCallback, useRef, useState } from 'react'
import { ScrollView } from 'react-native'
import styled from 'styled-components/native'

import { ReportedOffer, SubcategoryIdEnum } from 'api/gen'
import { useSearchVenueOffers } from 'api/useSearchVenuesOffer/useSearchVenueOffers'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator/types'
import { useOffer } from 'features/offer/api/useOffer'
import { useReportedOffers } from 'features/offer/api/useReportedOffers'
import { LocationCaption } from 'features/offer/components/LocationCaption'
import { OfferIconCaptions } from 'features/offer/components/OfferIconCaptions/OfferIconCaptions'
import { OfferPartialDescription } from 'features/offer/components/OfferPartialDescription/OfferPartialDescription'
import { OfferTile } from 'features/offer/components/OfferTile/OfferTile'
import { ReportOfferModal } from 'features/offer/components/ReportOfferModal/ReportOfferModal'
import { MessagingApps } from 'features/offer/components/shareMessagingOffer/MessagingApps'
import { VenueSection } from 'features/offer/components/VenueSection/VenueSection'
import { VenueSelectionModal } from 'features/offer/components/VenueSelectionModal/VenueSelectionModal'
import { PlaylistType } from 'features/offer/enums'
import { getVenueSectionTitle } from 'features/offer/helpers/getVenueSectionTitle/getVenueSectionTitle'
import { useTrackOfferSeenDuration } from 'features/offer/helpers/useTrackOfferSeenDuration'
import { isUserBeneficiary } from 'features/profile/helpers/isUserBeneficiary'
import { isUserExBeneficiary } from 'features/profile/helpers/isUserExBeneficiary'
import { ANIMATION_DURATION } from 'features/venue/components/VenuePartialAccordionDescription/VenuePartialAccordionDescription'
import { accessibilityAndTestId } from 'libs/accessibilityAndTestId'
import {
  formatFullAddress,
  formatFullAddressWithVenueName,
} from 'libs/address/useFormatFullAddress'
import { analytics } from 'libs/analytics'
import { getPlaylistItemDimensionsFromLayout } from 'libs/contentful/dimensions'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useGeolocation } from 'libs/geolocation'
import { WhereSection } from 'libs/geolocation/components/WhereSection'
import { useIsFalseWithDelay } from 'libs/hooks/useIsFalseWithDelay'
import { formatDates, formatDistance, getDisplayPrice, getFormattedDates } from 'libs/parsers'
import { highlightLinks } from 'libs/parsers/highlightLinks'
import {
  useCategoryHomeLabelMapping,
  useCategoryIdMapping,
  useSubcategoriesMapping,
} from 'libs/subcategories'
import { Offer } from 'shared/offer/types'
import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'
import { AccessibilityBlock } from 'ui/components/accessibility/AccessibilityBlock'
import { AccordionItem } from 'ui/components/AccordionItem'
import { ButtonSecondary } from 'ui/components/buttons/ButtonSecondary'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { Hero } from 'ui/components/hero/Hero'
import { useModal } from 'ui/components/modals/useModal'
import { PassPlaylist } from 'ui/components/PassPlaylist'
import { CustomListRenderItem } from 'ui/components/Playlist'
import { SectionWithDivider } from 'ui/components/SectionWithDivider'
import { useScrollWhenAccordionItemOpens } from 'ui/hooks/useScrollWhenAccordionOpens'
import { Flag as DefaultFlag } from 'ui/svg/icons/Flag'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

interface Props {
  offerId: number
  onScroll: () => void
  sameCategorySimilarOffers?: Offer[]
  otherCategoriesSimilarOffers?: Offer[]
  shouldUseAlgoliaRecommend?: boolean
}

const keyExtractor = (item: Offer) => item.objectID

function isArrayNotEmpty<T>(data: T[] | undefined): data is T[] {
  return Boolean(data?.length)
}

export const OfferBody: FunctionComponent<Props> = ({
  offerId,
  onScroll,
  sameCategorySimilarOffers,
  otherCategoriesSimilarOffers,
  shouldUseAlgoliaRecommend,
}) => {
  const { navigate } = useNavigation<UseNavigationType>()
  const route = useRoute<UseRouteType<'Offer'>>()
  const { data: offer } = useOffer({ offerId })
  const { user } = useAuthContext()
  const scrollViewRef = useRef<ScrollView | null>(null)
  const mapping = useSubcategoriesMapping()
  const enableMultivenueOffer = useFeatureFlag(RemoteStoreFeatureFlags.WIP_ENABLE_MULTIVENUE_OFFER)
  const isMultivenueCompatibleOffer = Boolean(
    offer?.subcategoryId === SubcategoryIdEnum.LIVRE_PAPIER ||
      offer?.subcategoryId === SubcategoryIdEnum.LIVRE_AUDIO_PHYSIQUE
  )
  const { userPosition: position } = useGeolocation()

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

  const [isReportOfferModalVisible, setIsReportOfferModalVisible] = useState(false)
  const showReportOfferDescription = () => setIsReportOfferModalVisible(true)
  const hideReportOfferDescription = () => setIsReportOfferModalVisible(false)

  useTrackOfferSeenDuration(offerId)

  const categoryMapping = useCategoryIdMapping()
  const labelMapping = useCategoryHomeLabelMapping()

  const { onScroll: onScrollModal } = useOpacityTransition()

  const fromOfferId = route.params?.fromOfferId

  const trackingOnHorizontalScroll = useCallback(() => {
    return analytics.logPlaylistHorizontalScroll(fromOfferId)
  }, [fromOfferId])

  const { itemWidth, itemHeight } = getPlaylistItemDimensionsFromLayout('two-items')

  const renderItem: CustomListRenderItem<Offer> = useCallback(
    ({ item, width, height, playlistType }) => {
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
          shouldUseAlgoliaRecommend={shouldUseAlgoliaRecommend}
          playlistType={playlistType}
        />
      )
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [position, labelMapping, categoryMapping, offerId]
  )

  const { data: reportedOffersResponse } = useReportedOffers()
  const isOfferAlreadyReported = reportedOffersResponse?.reportedOffers?.find(
    (reportedOffer: ReportedOffer) => reportedOffer.offerId === offerId
  )

  const {
    visible: isChangeVenueModalVisible,
    showModal: showChangeVenueModal,
    hideModal: hideChangeVenueModal,
  } = useModal(false)

  const onNewOfferVenueSelected = useCallback(
    (nextOfferId: number) => {
      hideChangeVenueModal()
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

  const formattedDate = getFormattedDates(dates)
  const shouldDisplayWhenBlock = isEvent && !!formattedDate
  const shouldShowAccessibility = Object.values(accessibility).some(
    (value) => value !== undefined && value !== null
  )

  const capitalizedFormattedDate =
    typeof formattedDate === 'string'
      ? formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)
      : formattedDate

  const venueSectionTitle = getVenueSectionTitle(offer.subcategoryId, isEvent)

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
        <MessagingApps offerId={offerId} isEvent={isEvent} />
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

      <SectionWithDivider
        visible={!!user && (isUserBeneficiary(user) || isUserExBeneficiary(user))}
        margin>
        <SectionReportOffer>
          <ButtonTertiaryBlack
            inline
            wording={isOfferAlreadyReported ? 'Tu as déjà signalé cette offre' : 'Signaler l’offre'}
            disabled={!!isOfferAlreadyReported}
            icon={Flag}
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

      {!!isArrayNotEmpty(sameCategorySimilarOffers) && (
        <SectionWithDivider testID="sameCategorySimilarOffers" visible>
          <Spacer.Column numberOfSpaces={6} />
          <PassPlaylist
            data={sameCategorySimilarOffers}
            itemWidth={itemWidth}
            itemHeight={itemHeight}
            renderItem={renderItem}
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
            renderItem={renderItem}
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
          onRefresh={void refetch}
          onScroll={onScrollModal}
          nbLoadedHits={nbLoadedHits}
          nbHits={nbHits}
          isFetchingNextPage={isFetchingNextPage}
          isSharingLocation={Boolean(position !== null)}
          venueName={offer.venue.publicName ?? offer.venue.name}
        />
      ) : null}
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
