import { useNavigation, useRoute } from '@react-navigation/native'
import { useQueryClient } from '@tanstack/react-query'
import React, {
  FunctionComponent,
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useRef,
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

import { OfferResponseV2, ReactionTypeEnum, RecommendationApiParams } from 'api/gen'
import { ChronicleCardData } from 'features/chronicle/type'
import { useFavorite } from 'features/favorites/hooks/useFavorite'
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
import { getAnimationState } from 'ui/animations/helpers/getAnimationState'
import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'
import { AnchorProvider } from 'ui/components/anchor/AnchorContext'
import { FavoriteButton } from 'ui/components/buttons/FavoriteButton'
import { SectionWithDivider } from 'ui/components/SectionWithDivider'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { getSpacing } from 'ui/theme'

type OfferContentBaseProps = OfferContentProps &
  PropsWithChildren<{
    BodyWrapper: FunctionComponent
    onOfferPreviewPress: (index?: number) => void
    onShowChroniclesWritersModal: () => void
    onVideoConsentPress?: () => void
    chronicles?: ChronicleCardData[]
    likesCount?: number
    headlineOffersCount?: number
    defaultReaction?: ReactionTypeEnum | null
    onReactionButtonPress?: () => void
    contentContainerStyle?: StyleProp<ViewStyle>
    onLayout?: (params: LayoutChangeEvent) => void
    chronicleVariantInfo?: ChronicleVariantInfo
    isVideoSectionEnabled?: boolean
  }>

const DELAY_BEFORE_CONSIDERING_PAGE_SEEN = 5000

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
  segment,
  enableVideoABTesting,
  children,
}) => {
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
  const { showErrorSnackBar } = useSnackBarContext()

  const {
    sameCategorySimilarOffers,
    apiRecoParamsSameCategory,
    otherCategoriesSimilarOffers,
    apiRecoParamsOtherCategories,
  } = useOfferPlaylist({ offer, offerSearchGroup: subcategory.searchGroupName, searchGroupList })
  const scrollViewRef = useRef<ScrollView>(null)
  const scrollYRef = useRef<number>(0)

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
  const cachedOffer = queryClient.getQueryData<OfferResponseV2>([QueryKeys.OFFER, offer.id])

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
      showErrorSnackBar({
        message: 'L’offre n’a pas été retirée de tes favoris',
        timeout: SNACK_BAR_TIME_OUT,
      })
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

  const offerCtaButton = (
    <OfferCTAButton
      offer={offer}
      subcategory={subcategory}
      trackEventHasSeenOfferOnce={trackEventHasSeenOfferOnce}
    />
  )

  const { animationState } = getAnimationState(theme, headerTransition)

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

  return (
    <Container>
      <AnchorProvider scrollViewRef={scrollViewRef} handleCheckScrollY={handleCheckScrollY}>
        <OfferWebMetaHeader offer={offer} />
        <OfferHeader title={offer.name} headerTransition={headerTransition} offer={offer}>
          {onReactionButtonPress ? (
            <OfferReactionHeaderButton
              onPress={onReactionButtonPress}
              defaultReaction={defaultReaction}
              animationState={animationState}
            />
          ) : (
            <FavoriteButton
              animationState={animationState}
              offerId={offer.id}
              addFavorite={addFavorite}
              isAddFavoriteLoading={isAddFavoriteLoading}
              removeFavorite={removeFavorite}
              isRemoveFavoriteLoading={isRemoveFavoriteLoading}
              favorite={favorite}
            />
          )}
        </OfferHeader>
        <ScrollViewContainer
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
              segment={segment}
              enableVideoABTesting={enableVideoABTesting}
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
              userId={userId}
              isVideoSectionEnabled={isVideoSectionEnabled}
              hasVideoCookiesConsent={hasVideoCookiesConsent}
              onVideoConsentPress={onVideoConsentPress}
              enableVideoABTesting={enableVideoABTesting}>
              {theme.isDesktopViewport ? (
                <OfferContentCTAs offer={offer} {...favoriteButtonProps}>
                  {offerCtaButton}
                </OfferContentCTAs>
              ) : null}
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
        </ScrollViewContainer>
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

const ScrollViewContainer = React.memo(
  styled(IntersectionObserverScrollView)({
    overflow: 'visible',
  })
)
const FooterContainer = styled.View({
  marginTop: getSpacing(18),
})

const StyledSectionWithDivider = styled(SectionWithDivider)(({ theme }) => ({
  paddingBottom: theme.designSystem.size.spacing.xxl,
}))
