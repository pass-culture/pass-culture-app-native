import { useNavigation, useRoute } from '@react-navigation/native'
import { useQueryClient } from '@tanstack/react-query'
import React, {
  ComponentType,
  FunctionComponent,
  PropsWithChildren,
  useCallback,
  useMemo,
  useRef,
} from 'react'
import { LayoutChangeEvent, StyleProp, ViewStyle, ViewToken } from 'react-native'
import { IOScrollView as IntersectionObserverScrollView } from 'react-native-intersection-observer'
import styled, { useTheme } from 'styled-components/native'

import { OfferArtist, OfferResponse, ReactionTypeEnum } from 'api/gen'
import { ChronicleCardData } from 'features/chronicle/type'
import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator/types'
import { OfferBody } from 'features/offer/components/OfferBody/OfferBody'
import { ChroniclesSectionWithAnchor } from 'features/offer/components/OfferContent/ChronicleSection/ChroniclesSectionWithAnchor'
import { ChronicleVariantInfo } from 'features/offer/components/OfferContent/ChronicleSection/types'
import { OfferCTAButton } from 'features/offer/components/OfferCTAButton/OfferCTAButton'
import { OfferContentCTAs } from 'features/offer/components/OfferFooter/OfferContentCTAs'
import { OfferHeader } from 'features/offer/components/OfferHeader/OfferHeader'
import { OfferReactionHeaderButton } from 'features/offer/components/OfferHeader/OfferReactionHeaderButton'
import { OfferImageContainer } from 'features/offer/components/OfferImageContainer/OfferImageContainer'
import { OfferMessagingApps } from 'features/offer/components/OfferMessagingApps/OfferMessagingApps'
import { OfferPlaylistList } from 'features/offer/components/OfferPlaylistList/OfferPlaylistList'
import { OfferWebMetaHeader } from 'features/offer/components/OfferWebMetaHeader'
import { getVenue } from 'features/offer/helpers/getVenueBlockProps'
import { useOfferImageContainerDimensions } from 'features/offer/helpers/useOfferImageContainerDimensions'
import { useOfferPlaylist } from 'features/offer/helpers/useOfferPlaylist/useOfferPlaylist'
import { useOfferContentTracking } from 'features/offer/hooks/useOfferContentTracking'
import { useOfferFavorites } from 'features/offer/hooks/useOfferFavorites'
import { useOfferScroll } from 'features/offer/hooks/useOfferScroll'
import { OfferContentProps } from 'features/offer/types'
import { analytics } from 'libs/analytics/provider'
import { getDistance } from 'libs/location/getDistance'
import { useLocation } from 'libs/location/location'
import { QueryKeys } from 'libs/queryKeys'
import { getImagesUrlsWithCredit } from 'shared/getImagesUrlsWithCredit/getImagesUrlsWithCredit'
import { usePageTracking } from 'shared/tracking/usePageTracking'
import { ImageWithCredit } from 'shared/types'
import { AnchorProvider } from 'ui/components/anchor/AnchorContext'
import { FavoriteButton } from 'ui/components/buttons/FavoriteButton'
import { SectionWithDivider } from 'ui/components/SectionWithDivider'

type OfferContentBaseProps = OfferContentProps &
  PropsWithChildren<{
    BodyWrapper: ComponentType<PropsWithChildren>
    onOfferPreviewPress: (index?: number) => void
    onShowChroniclesWritersModal: () => void
    onShowOfferArtistsModal: (artists: OfferArtist[]) => void
    onVideoConsentPress?: () => void
    chronicles?: ChronicleCardData[]
    headlineOffersCount?: number
    defaultReaction?: ReactionTypeEnum | null
    onReactionButtonPress?: () => void
    contentContainerStyle?: StyleProp<ViewStyle>
    onLayout?: (params: LayoutChangeEvent) => void
    chronicleVariantInfo?: ChronicleVariantInfo
    isVideoSectionEnabled?: boolean
  }>

export const OfferContentBase: FunctionComponent<OfferContentBaseProps> = ({
  offer,
  searchGroupList,
  subcategory,
  chronicles,
  chronicleVariantInfo,
  headlineOffersCount,
  onOfferPreviewPress,
  contentContainerStyle,
  defaultReaction,
  onReactionButtonPress,
  onShowChroniclesWritersModal,
  isVideoSectionEnabled,
  BodyWrapper = React.Fragment,
  onLayout,
  userId,
  hasVideoCookiesConsent,
  onVideoConsentPress,
  isMultiArtistsEnabled,
  onShowOfferArtistsModal,
  HeaderComponent,
  BodyComponent,
  children,
}) => {
  const HeaderToRender = HeaderComponent || OfferHeader
  const theme = useTheme()

  // P1-05 — Extracted hooks (scroll, tracking, favorites)
  const { scrollListener, trackEventHasSeenOfferOnce } = useOfferContentTracking({
    offerId: offer.id,
    subcategoryId: subcategory.id,
  })
  const { scrollViewRef, headerTransition, handleScroll, handleCheckScrollY } = useOfferScroll({
    scrollListener,
  })
  const favoriteButtonProps = useOfferFavorites(offer)

  // Body data — owned here so both inline (legacy) and BodyComponent (new) paths share tracking
  const { navigate } = useNavigation<UseNavigationType>()
  const { params } = useRoute<UseRouteType<'Offer'>>()

  const pageTracking = usePageTracking({
    pageName: 'Offer',
    pageLocation: 'offer',
    pageId: params.id.toString(),
  })

  const {
    sameCategorySimilarOffers,
    apiRecoParamsSameCategory,
    otherCategoriesSimilarOffers,
    apiRecoParamsOtherCategories,
  } = useOfferPlaylist({ offer, offerSearchGroup: subcategory.searchGroupName, searchGroupList })

  const { userLocation, selectedPlace, selectedLocationMode } = useLocation()
  const venue = getVenue(offer.venue)
  const distance = venue.coordinates
    ? getDistance(
        { lat: venue.coordinates.latitude, lng: venue.coordinates.longitude },
        { userLocation, selectedPlace, selectedLocationMode },
        offer.subcategoryId
      )
    : null

  // We want to show images from offer when it's loaded. Not the one preloaded in query cache...
  const offerImages: ImageWithCredit[] = useMemo(
    () =>
      offer.metadata && offer.images ? getImagesUrlsWithCredit<ImageWithCredit>(offer.images) : [],
    [offer]
  )

  const queryClient = useQueryClient()
  const cachedOffer = queryClient.getQueryData<OfferResponse>([QueryKeys.OFFER, offer.id])

  // Extract cached image before it's been updated by next offer query
  const placeholderImage = useRef(cachedOffer?.images?.recto?.url).current

  const imageDimensions = useOfferImageContainerDimensions(offer.subcategoryId)

  const onSeeMoreButtonPress = (chronicleId: number) => {
    // It's dirty but necessary to use from parameter for the logs
    navigate('Chronicles', { offerId: offer.id, chronicleId, from: 'chronicles' })
    void analytics.logConsultChronicle({ offerId: offer.id, chronicleId })
  }

  const handleOnSeeAllReviewsPress = () => {
    void analytics.logClickInfoReview({
      from: 'offer',
      offerId: offer.id.toString(),
      categoryName: subcategory.categoryId,
      userId: userId?.toString(),
    })
  }

  const handleViewableItemsChanged = useCallback(
    (
      items: Pick<ViewToken, 'key' | 'index'>[],
      moduleId: string,
      itemType: 'offer' | 'venue' | 'artist' | 'unknown',
      playlistIndex?: number
    ) => {
      pageTracking.trackViewableItems({
        moduleId,
        itemType,
        viewableItems: items,
        playlistIndex,
        entryId: offer.id.toString(),
      })
    },
    [offer.id, pageTracking]
  )

  const offerCtaButton = (
    <OfferCTAButton
      offer={offer}
      subcategory={subcategory}
      trackEventHasSeenOfferOnce={trackEventHasSeenOfferOnce}
    />
  )

  const desktopCTAs = theme.isDesktopViewport ? (
    <OfferContentCTAs offer={offer} {...favoriteButtonProps}>
      {offerCtaButton}
    </OfferContentCTAs>
  ) : null

  return (
    <Container>
      <AnchorProvider scrollViewRef={scrollViewRef} handleCheckScrollY={handleCheckScrollY}>
        <OfferWebMetaHeader offer={offer} />
        <HeaderToRender title={offer.name} headerTransition={headerTransition} offer={offer}>
          {onReactionButtonPress ? (
            <OfferReactionHeaderButton
              onPress={onReactionButtonPress}
              defaultReaction={defaultReaction}
            />
          ) : (
            <FavoriteButton offerId={offer.id} {...favoriteButtonProps} />
          )}
        </HeaderToRender>
        <IntersectionObserverScrollView
          testID="offerv2-container"
          scrollEventThrottle={16}
          scrollIndicatorInsets={scrollIndicatorInsets}
          bounces={false}
          ref={scrollViewRef}
          contentContainerStyle={contentContainerStyle}
          onScroll={handleScroll}>
          {BodyComponent ? (
            <BodyComponent
              offer={offer}
              subcategory={subcategory}
              searchGroupList={searchGroupList}
              chronicles={chronicles}
              chronicleVariantInfo={chronicleVariantInfo ?? { subtitleItem: '', label: '' }}
              headlineOffersCount={headlineOffersCount}
              isVideoSectionEnabled={isVideoSectionEnabled}
              hasVideoCookiesConsent={hasVideoCookiesConsent}
              onVideoConsentPress={onVideoConsentPress}
              isMultiArtistsEnabled={isMultiArtistsEnabled}
              onShowOfferArtistsModal={onShowOfferArtistsModal}
              onShowChroniclesWritersModal={onShowChroniclesWritersModal}
              onOfferPreviewPress={onOfferPreviewPress}
              onViewableItemsChanged={handleViewableItemsChanged}
              userId={userId}
              BodyWrapper={BodyWrapper}
              desktopCTAs={desktopCTAs}>
              {children}
            </BodyComponent>
          ) : (
            <React.Fragment>
              <BodyWrapper>
                <OfferImageContainer
                  images={offerImages}
                  categoryId={subcategory.categoryId}
                  onPress={onOfferPreviewPress}
                  placeholderImage={placeholderImage}
                  imageDimensions={imageDimensions}
                  offer={offer}
                />
                <OfferBody
                  offer={offer}
                  subcategory={subcategory}
                  likesCount={offer.reactionsCount.likes}
                  chroniclesCount={offer.chroniclesCount}
                  chronicles={chronicles}
                  distance={distance}
                  headlineOffersCount={headlineOffersCount}
                  chronicleVariantInfo={chronicleVariantInfo}
                  isVideoSectionEnabled={isVideoSectionEnabled}
                  hasVideoCookiesConsent={hasVideoCookiesConsent}
                  onVideoConsentPress={onVideoConsentPress ?? (() => undefined)}
                  isMultiArtistsEnabled={isMultiArtistsEnabled}
                  onShowOfferArtistsModal={onShowOfferArtistsModal}>
                  {desktopCTAs}
                </OfferBody>
              </BodyWrapper>

              {chronicles?.length ? (
                <ChroniclesSectionWithAnchor
                  chronicles={chronicles}
                  chronicleVariantInfo={chronicleVariantInfo}
                  offer={offer}
                  onSeeMoreButtonPress={onSeeMoreButtonPress}
                  onShowChroniclesWritersModal={onShowChroniclesWritersModal}
                  onSeeAllReviewsPress={handleOnSeeAllReviewsPress}
                />
              ) : null}

              <StyledSectionWithDivider
                visible
                margin
                testID="messagingApp-container-with-divider"
                gap={8}>
                <OfferMessagingApps offer={offer} />
              </StyledSectionWithDivider>

              <OfferPlaylistList
                offer={offer}
                sameCategorySimilarOffers={sameCategorySimilarOffers}
                apiRecoParamsSameCategory={apiRecoParamsSameCategory}
                otherCategoriesSimilarOffers={otherCategoriesSimilarOffers}
                apiRecoParamsOtherCategories={apiRecoParamsOtherCategories}
                onViewableItemsChanged={handleViewableItemsChanged}
              />

              {children}
            </React.Fragment>
          )}
        </IntersectionObserverScrollView>
        {theme.isMobileViewport ? (
          <FooterContainer>
            <OfferContentCTAs offer={offer} onLayout={onLayout} {...favoriteButtonProps}>
              {offerCtaButton}
            </OfferContentCTAs>
          </FooterContainer>
        ) : null}
      </AnchorProvider>
    </Container>
  )
}

const scrollIndicatorInsets = { right: 1 }

const Container = styled.View({
  flex: 1,
})

const FooterContainer = styled.View(({ theme }) => ({
  marginTop: theme.isDesktopViewport ? undefined : theme.designSystem.size.spacing.xxs,
}))

const StyledSectionWithDivider = styled(SectionWithDivider)(({ theme }) => ({
  paddingBottom: theme.designSystem.size.spacing.xxl,
}))
