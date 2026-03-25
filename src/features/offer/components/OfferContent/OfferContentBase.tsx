import { useNavigation, useRoute } from '@react-navigation/native'
import { useQueryClient } from '@tanstack/react-query'
import React, {
  FunctionComponent,
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleProp,
  ViewStyle,
  ViewToken,
} from 'react-native'
import { IOScrollView as IntersectionObserverScrollView } from 'react-native-intersection-observer'
import styled, { useTheme } from 'styled-components/native'

import { OfferArtist, OfferResponse, ReactionTypeEnum, RecommendationApiParams } from 'api/gen'
import { AdviceCardData, AdviceVariantInfo } from 'features/advices/types'
import { useFavorite } from 'features/favorites/hooks/useFavorite'
import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator/types'
import { OfferBody } from 'features/offer/components/OfferBody/OfferBody'
import { ClubAdviceSectionWithAnchor } from 'features/offer/components/OfferContent/ClubAdviceSection/ClubAdviceSectionWithAnchor'
import { OfferCTAButton } from 'features/offer/components/OfferCTAButton/OfferCTAButton'
import { OfferContentCTAs } from 'features/offer/components/OfferFooter/OfferContentCTAs'
import { OfferHeader } from 'features/offer/components/OfferHeader/OfferHeader'
import { OfferReactionHeaderButton } from 'features/offer/components/OfferHeader/OfferReactionHeaderButton'
import { OfferImageContainer } from 'features/offer/components/OfferImageContainer/OfferImageContainer'
import { OfferMessagingApps } from 'features/offer/components/OfferMessagingApps/OfferMessagingApps'
import { OfferPlaylistList } from 'features/offer/components/OfferPlaylistList/OfferPlaylistList'
import { OfferWebMetaHeader } from 'features/offer/components/OfferWebMetaHeader'
import { getIsAComingSoonOffer } from 'features/offer/helpers/getIsAComingSoonOffer'
import { getVenue } from 'features/offer/helpers/getVenueBlockProps'
import { useOfferBatchTracking } from 'features/offer/helpers/useOfferBatchTracking/useOfferBatchTracking'
import { useOfferImageContainerDimensions } from 'features/offer/helpers/useOfferImageContainerDimensions'
import { useOfferPlaylist } from 'features/offer/helpers/useOfferPlaylist/useOfferPlaylist'
import { OfferContentProps } from 'features/offer/types'
import { isCloseToBottom } from 'libs/analytics'
import { analytics } from 'libs/analytics/provider'
import { useFunctionOnce } from 'libs/hooks'
import { getDistance } from 'libs/location/getDistance'
import { useLocation } from 'libs/location/location'
import { QueryKeys } from 'libs/queryKeys'
import { useAddFavoriteMutation } from 'queries/favorites/useAddFavoriteMutation'
import { useRemoveFavoriteMutation } from 'queries/favorites/useRemoveFavoriteMutation'
import { getImagesUrlsWithCredit } from 'shared/getImagesUrlsWithCredit/getImagesUrlsWithCredit'
import { usePageTracking } from 'shared/tracking/usePageTracking'
import { ImageWithCredit } from 'shared/types'
import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'
import { AnchorProvider } from 'ui/components/anchor/AnchorContext'
import { FavoriteButton } from 'ui/components/buttons/FavoriteButton'
import { SectionWithDivider } from 'ui/components/SectionWithDivider'
import { showErrorSnackBar } from 'ui/designSystem/Snackbar/snackBar.store'

type OfferContentBaseProps = OfferContentProps &
  PropsWithChildren<{
    BodyWrapper: FunctionComponent
    onOfferPreviewPress: (index?: number) => void
    onShowClubAdviceWritersModal: () => void
    onShowOfferArtistsModal: (artists: OfferArtist[]) => void
    onVideoConsentPress?: () => void
    advices?: AdviceCardData[]
    likesCount?: number
    headlineOffersCount?: number
    defaultReaction?: ReactionTypeEnum | null
    onReactionButtonPress?: () => void
    contentContainerStyle?: StyleProp<ViewStyle>
    onLayout?: (params: LayoutChangeEvent) => void
    adviceVariantInfo?: AdviceVariantInfo
    isVideoSectionEnabled?: boolean
  }>

const DELAY_BEFORE_CONSIDERING_PAGE_SEEN = 5000

export const OfferContentBase: FunctionComponent<OfferContentBaseProps> = ({
  offer,
  searchGroupList,
  subcategory,
  advices,
  adviceVariantInfo,
  headlineOffersCount,
  onOfferPreviewPress,
  contentContainerStyle,
  defaultReaction,
  onReactionButtonPress,
  onShowClubAdviceWritersModal,
  isVideoSectionEnabled,
  BodyWrapper = React.Fragment,
  onLayout,
  userId,
  hasVideoCookiesConsent,
  onVideoConsentPress,
  isMultiArtistsEnabled,
  onShowOfferArtistsModal,
  HeaderComponent,
  CTAsComponent,
  children,
}) => {
  const HeaderToRender = HeaderComponent || OfferHeader
  const theme = useTheme()

  const { navigate } = useNavigation<UseNavigationType>()
  const { params } = useRoute<UseRouteType<'Offer'>>()

  const pageTracking = usePageTracking({
    pageName: 'Offer',
    pageLocation: 'offer',
    pageId: params.id.toString(),
  })

  const apiRecoParams: RecommendationApiParams = params?.apiRecoParams
    ? JSON.parse(params?.apiRecoParams)
    : undefined

  const {
    sameCategorySimilarOffers,
    apiRecoParamsSameCategory,
    otherCategoriesSimilarOffers,
    apiRecoParamsOtherCategories,
  } = useOfferPlaylist({ offer, offerSearchGroup: subcategory.searchGroupName, searchGroupList })
  const scrollViewRef = useRef<ScrollView>(null)
  const scrollYRef = useRef<number>(0)
  const [isBottomReached, setIsBottomReached] = useState(false)
  const isBottomReachedRef = useRef(false)

  const logConsultWholeOffer = useFunctionOnce(() => {
    void analytics.logConsultWholeOffer(offer.id)
  })

  const { shouldTriggerBatchSurveyEvent, trackBatchEvent, trackEventHasSeenOfferOnce } =
    useOfferBatchTracking(subcategory.id)

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

  useEffect(() => {
    let timeoutId: number
    if (shouldTriggerBatchSurveyEvent) {
      timeoutId = setTimeout(() => {
        trackBatchEvent()
      }, DELAY_BEFORE_CONSIDERING_PAGE_SEEN)
    }

    return () => clearTimeout(timeoutId)
  }, [shouldTriggerBatchSurveyEvent, trackBatchEvent])

  const scrollEventListener = useCallback(
    ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (isCloseToBottom(nativeEvent)) {
        logConsultWholeOffer()
        if (shouldTriggerBatchSurveyEvent) {
          trackBatchEvent()
        }
      }
    },
    [logConsultWholeOffer, shouldTriggerBatchSurveyEvent, trackBatchEvent]
  )

  const { headerTransition, onScroll } = useOpacityTransition({
    listener: scrollEventListener,
  })

  const handleCheckScrollY = useRef(() => {
    return scrollYRef.current
  }).current

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      onScroll(event)
      scrollYRef.current = event.nativeEvent.contentOffset.y
      const closeToBottom = isCloseToBottom(event.nativeEvent)
      if (closeToBottom !== isBottomReachedRef.current) {
        isBottomReachedRef.current = closeToBottom
        setIsBottomReached(closeToBottom)
      }
    },
    [onScroll]
  )

  const { mutate: addFavorite, isPending: isAddFavoriteLoading } = useAddFavoriteMutation({
    onSuccess: () => {
      if (typeof offer.id === 'number' && params) {
        const { from, moduleName, moduleId, searchId, playlistType } = params
        analytics.logHasAddedOfferToFavorites({
          from: getIsAComingSoonOffer(offer.bookingAllowedDatetime) ? 'comingSoonOffer' : from,
          offerId: offer.id,
          moduleName,
          moduleId,
          searchId,
          ...apiRecoParams,
          playlistType,
        })
      }
    },
  })

  const { mutate: removeFavorite, isPending: isRemoveFavoriteLoading } = useRemoveFavoriteMutation({
    onError: () => {
      showErrorSnackBar('L’offre n’a pas été retirée de tes favoris')
    },
  })

  const favorite = useFavorite({ offerId: offer.id })

  const favoriteButtonProps = {
    addFavorite,
    isAddFavoriteLoading,
    removeFavorite,
    isRemoveFavoriteLoading,
    favorite,
  }

  const imageDimensions = useOfferImageContainerDimensions(offer.subcategoryId)

  const onSeeMoreButtonPress = (adviceId: number) => {
    // It's dirty but necessary to use from parameter for the logs
    navigate('ClubAdvices', { offerId: offer.id, adviceId, from: 'chronicles' })
    void analytics.logConsultChronicle({ offerId: offer.id, chronicleId: adviceId })
  }

  const handleOnSeeAllReviewsPress = () => {
    void analytics.logClickInfoReview({
      from: 'offer',
      offerId: offer.id.toString(),
      categoryName: subcategory.categoryId,
      userId: userId?.toString(),
    })
  }

  const offerCtaButton = (
    <OfferCTAButton
      offer={offer}
      subcategory={subcategory}
      trackEventHasSeenOfferOnce={trackEventHasSeenOfferOnce}
      displayStickyGradient={!isBottomReached}
    />
  )

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

  const OfferCTAsComponent = CTAsComponent ? (
    <CTAsComponent
      offer={offer}
      subcategory={subcategory}
      trackEventHasSeenOfferOnce={trackEventHasSeenOfferOnce}
      favoriteCTAProps={favoriteButtonProps}
      onLayout={onLayout}
    />
  ) : (
    <OfferContentCTAs offer={offer} onLayout={onLayout} {...favoriteButtonProps}>
      {offerCtaButton}
    </OfferContentCTAs>
  )

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
            <FavoriteButton
              offerId={offer.id}
              addFavorite={addFavorite}
              isAddFavoriteLoading={isAddFavoriteLoading}
              removeFavorite={removeFavorite}
              isRemoveFavoriteLoading={isRemoveFavoriteLoading}
              favorite={favorite}
            />
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
              advicesCount={offer.chroniclesCount}
              advices={advices}
              distance={distance}
              headlineOffersCount={headlineOffersCount}
              adviceVariantInfo={adviceVariantInfo}
              isVideoSectionEnabled={isVideoSectionEnabled}
              hasVideoCookiesConsent={hasVideoCookiesConsent}
              onVideoConsentPress={onVideoConsentPress}
              isMultiArtistsEnabled={isMultiArtistsEnabled}
              onShowOfferArtistsModal={onShowOfferArtistsModal}>
              {theme.isDesktopViewport ? OfferCTAsComponent : null}
            </OfferBody>
          </BodyWrapper>

          {advices?.length ? (
            <ClubAdviceSectionWithAnchor
              advices={advices}
              adviceVariantInfo={adviceVariantInfo}
              offer={offer}
              onSeeMoreButtonPress={onSeeMoreButtonPress}
              onShowClubAdviceWritersModal={onShowClubAdviceWritersModal}
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
        </IntersectionObserverScrollView>
        {theme.isMobileViewport ? <FooterContainer>{OfferCTAsComponent}</FooterContainer> : null}
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
