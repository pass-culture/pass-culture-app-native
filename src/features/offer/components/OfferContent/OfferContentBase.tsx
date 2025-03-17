import { useNavigation, useRoute } from '@react-navigation/native'
import React, { FunctionComponent, useCallback, useEffect, useMemo, useRef } from 'react'
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleProp,
  ViewStyle,
} from 'react-native'
import { IOScrollView as IntersectionObserverScrollView } from 'react-native-intersection-observer'
import { useQueryClient } from 'react-query'
import styled, { useTheme } from 'styled-components/native'

import { OfferResponseV2, ReactionTypeEnum, RecommendationApiParams } from 'api/gen'
import { ChronicleCardData } from 'features/chronicle/type'
import { useFavorite } from 'features/favorites/hooks/useFavorite'
import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator/types'
import { OfferBody } from 'features/offer/components/OfferBody/OfferBody'
import { ChronicleSection } from 'features/offer/components/OfferContent/ChronicleSection/ChronicleSection'
import { OfferCTAButton } from 'features/offer/components/OfferCTAButton/OfferCTAButton'
import { OfferFooter } from 'features/offer/components/OfferFooter/OfferFooter'
import { OfferHeader } from 'features/offer/components/OfferHeader/OfferHeader'
import { OfferReactionHeaderButton } from 'features/offer/components/OfferHeader/OfferReactionHeaderButton'
import { OfferImageContainer } from 'features/offer/components/OfferImageContainer/OfferImageContainer'
import { OfferMessagingApps } from 'features/offer/components/OfferMessagingApps/OfferMessagingApps'
import { OfferPlaylistList } from 'features/offer/components/OfferPlaylistList/OfferPlaylistList'
import { OfferWebMetaHeader } from 'features/offer/components/OfferWebMetaHeader'
import { getIsAComingSoonOffer } from 'features/offer/helpers/getIsAComingSoonOffer'
import { useOfferBatchTracking } from 'features/offer/helpers/useOfferBatchTracking/useOfferBatchTracking'
import { useOfferPlaylist } from 'features/offer/helpers/useOfferPlaylist/useOfferPlaylist'
import { OfferContentProps } from 'features/offer/types'
import { isCloseToBottom } from 'libs/analytics'
import { analytics } from 'libs/analytics/provider'
import { useFunctionOnce } from 'libs/hooks'
import { QueryKeys } from 'libs/queryKeys'
import { useAddFavoriteMutation } from 'queries/favorites/useAddFavoriteMutation'
import { useRemoveFavoriteMutation } from 'queries/favorites/useRemoveFavoriteMutation'
import { getImagesUrlsWithCredit } from 'shared/getImagesUrlsWithCredit/getImagesUrlsWithCredit'
import { ImageWithCredit } from 'shared/types'
import { getAnimationState } from 'ui/animations/helpers/getAnimationState'
import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'
import { AnchorProvider } from 'ui/components/anchor/AnchorContext'
import { FavoriteButton } from 'ui/components/buttons/FavoriteButton'
import { SectionWithDivider } from 'ui/components/SectionWithDivider'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { getSpacing } from 'ui/theme'

type OfferContentBaseProps = OfferContentProps & {
  BodyWrapper: FunctionComponent
  onOfferPreviewPress: (index?: number) => void
  chronicles?: ChronicleCardData[]
  likesCount?: number
  defaultReaction?: ReactionTypeEnum | null
  onReactionButtonPress?: () => void
  contentContainerStyle?: StyleProp<ViewStyle>
}

const DELAY_BEFORE_CONSIDERING_PAGE_SEEN = 5000

export const OfferContentBase: FunctionComponent<OfferContentBaseProps> = ({
  offer,
  searchGroupList,
  subcategory,
  chronicles,
  onOfferPreviewPress,
  contentContainerStyle,
  defaultReaction,
  onReactionButtonPress,
  BodyWrapper = React.Fragment,
}) => {
  const theme = useTheme()

  const { navigate } = useNavigation<UseNavigationType>()
  const { params } = useRoute<UseRouteType<'Offer'>>()

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
    analytics.logConsultWholeOffer(offer.id)
  })

  const { shouldTriggerBatchSurveyEvent, trackBatchEvent, trackEventHasSeenOfferOnce } =
    useOfferBatchTracking(subcategory.id)

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
    let timeoutId: NodeJS.Timeout
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

  const { mutate: addFavorite, isLoading: isAddFavoriteLoading } = useAddFavoriteMutation({
    onSuccess: () => {
      if (typeof offer.id === 'number' && params) {
        const { from, moduleName, moduleId, searchId, playlistType } = params
        analytics.logHasAddedOfferToFavorites({
          from: getIsAComingSoonOffer(offer) ? 'comingSoonOffer' : from,
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

  const { mutate: removeFavorite, isLoading: isRemoveFavoriteLoading } = useRemoveFavoriteMutation({
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

  const onSeeMoreButtonPress = (chronicleId: number) => {
    // It's dirty but necessary to use from parameter for the logs
    navigate('Chronicles', { offerId: offer.id, chronicleId, from: 'chronicles' })
    analytics.logConsultChronicle({ offerId: offer.id, chronicleId })
  }

  const offerCtaButton = (
    <OfferCTAButton
      offer={offer}
      subcategory={subcategory}
      trackEventHasSeenOfferOnce={trackEventHasSeenOfferOnce}
    />
  )

  const { animationState } = getAnimationState(theme, headerTransition)

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
            />
            <OfferBody
              offer={offer}
              subcategory={subcategory}
              likesCount={offer.reactionsCount.likes}
              chroniclesCount={chronicles?.length}>
              {theme.isDesktopViewport ? offerCtaButton : null}
            </OfferBody>
          </BodyWrapper>
          {chronicles?.length ? (
            <StyledSectionWithDivider visible testID="chronicles-section" gap={8}>
              <ChronicleSection
                title="La reco du Book Club"
                ctaLabel="Voir tous les avis"
                subtitle="Notre communauté de lecteurs te partagent leurs avis sur ce livre&nbsp;!"
                data={chronicles}
                // It's dirty but necessary to use from parameter for the logs
                navigateTo={{
                  screen: 'Chronicles',
                  params: { offerId: offer.id, from: 'chronicles' },
                }}
                onSeeMoreButtonPress={onSeeMoreButtonPress}
              />
            </StyledSectionWithDivider>
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
          />
        </ScrollViewContainer>
        <OfferFooter offer={offer} {...favoriteButtonProps}>
          {offerCtaButton}
        </OfferFooter>
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

const StyledSectionWithDivider = styled(SectionWithDivider)({
  paddingBottom: getSpacing(8),
})
