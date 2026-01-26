import { useNavigation, useRoute } from '@react-navigation/native'
import { UseMutateFunction, useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo } from 'react'
import { ViewToken } from 'react-native'
import { Social } from 'react-native-share'

import { ApiError } from 'api/ApiError'
import {
  BookingReponse,
  FavoriteRequest,
  FavoriteResponse,
  OfferResponseV2,
  ReactionTypeEnum,
  RecommendationApiParams,
  SubcategoriesResponseModelv2,
  SubcategoryResponseModelv2,
} from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { ChronicleCardData } from 'features/chronicle/type'
import { ConsentState, CookieNameEnum } from 'features/cookies/enums'
import { useCookies } from 'features/cookies/helpers/useCookies'
import { useFavorite } from 'features/favorites/hooks/useFavorite'
import { FavoriteMutationContext } from 'features/favorites/queries/types'
import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator/types'
import { getSearchHookConfig } from 'features/navigation/SearchStackNavigator/getSearchHookConfig'
import { useGoBack } from 'features/navigation/useGoBack'
import { chroniclePreviewToChronicalCardData } from 'features/offer/adapters/chroniclePreviewToChronicleCardData'
import { ChronicleVariantInfo } from 'features/offer/components/OfferContent/ChronicleSection/types'
import { chronicleVariant } from 'features/offer/helpers/chronicleVariant/chronicleVariant'
import { useOfferImageContainerDimensions } from 'features/offer/helpers/useOfferImageContainerDimensions'
import { selectReminderByOfferId } from 'features/offer/queries/selectors/selectReminderByOfferId'
import { useAddReminderMutation } from 'features/offer/queries/useAddReminderMutation'
import { useDeleteReminderMutation } from 'features/offer/queries/useDeleteReminderMutation'
import { useFetchHeadlineOffersCountQuery } from 'features/offer/queries/useFetchHeadlineOffersCountQuery'
import { useGetRemindersQuery } from 'features/offer/queries/useGetRemindersQuery'
import { OfferImageContainerDimensions } from 'features/offer/types'
import { ANIMATION_DURATION } from 'features/offerRefacto/constants'
import { getIsAComingSoonOffer, mergeVenueData } from 'features/offerRefacto/helpers'
import { useReactionMutation } from 'features/reactions/queries/useReactionMutation'
import { getShareOffer } from 'features/share/helpers/getShareOffer'
import { UserProfileResponseWithoutSurvey } from 'features/share/types'
import { triggerConsultOfferLog } from 'libs/analytics/helpers/triggerLogConsultOffer/triggerConsultOfferLog'
import { analytics } from 'libs/analytics/provider'
import { EmptyResponse } from 'libs/fetch'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useIsFalseWithDelay } from 'libs/hooks/useIsFalseWithDelay'
import {
  formatStartPrice,
  getDisplayedPrice,
  getIfPricesShouldBeFixed,
} from 'libs/parsers/getDisplayedPrice'
import { QueryKeys } from 'libs/queryKeys'
import { ShareContent } from 'libs/share/types'
import { useSubcategoriesMapping } from 'libs/subcategories/mappings'
import { useEndedBookingFromOfferIdQuery } from 'queries/bookings'
import { useAddFavoriteMutation } from 'queries/favorites/useAddFavoriteMutation'
import { useRemoveFavoriteMutation } from 'queries/favorites/useRemoveFavoriteMutation'
import { useOfferQuery } from 'queries/offer/useOfferQuery'
import { useSubcategoriesQuery } from 'queries/subcategories/useSubcategoriesQuery'
import { useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'
import { useGetPacificFrancToEuroRate } from 'shared/exchangeRates/useGetPacificFrancToEuroRate'
import { getImagesUrlsWithCredit } from 'shared/getImagesUrlsWithCredit/getImagesUrlsWithCredit'
import { isMultiVenueCompatibleOffer } from 'shared/multiVenueOffer/isMultiVenueCompatibleOffer'
import { Offer } from 'shared/offer/types'
import { runAfterInteractionsMobile } from 'shared/runAfterInteractionsMobile/runAfterInteractionsMobile'
import { usePageTracking } from 'shared/tracking/usePageTracking'
import { ImageWithCredit } from 'shared/types'
import { useModal } from 'ui/components/modals/useModal'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'

type SubmitReactionArgs = {
  offerId: number
  reactionType: ReactionTypeEnum
}

interface OfferPageViewModel {
  // Data
  offer?: OfferResponseV2
  user?: UserProfileResponseWithoutSurvey
  subcategories?: SubcategoriesResponseModelv2
  booking?: BookingReponse | null
  subcategory?: SubcategoryResponseModelv2
  chronicleVariantInfo?: ChronicleVariantInfo
  chronicles?: ChronicleCardData[]
  headlineOffersCount?: number
  favorite?: FavoriteResponse | null
  images: ImageWithCredit[]
  placeholderImage?: string
  imageDimensions: OfferImageContainerDimensions
  shareContent: ShareContent | null

  // UI state
  showSkeleton: boolean
  hasVideoCookiesConsent: boolean
  reactionModalVisible: boolean
  chroniclesWritersModalVisible: boolean
  offerArtistsModalVisible: boolean
  shareOfferModalVisible: boolean
  isMultiArtistsEnabled?: boolean
  isAddFavoriteLoading: boolean
  isRemoveFavoriteLoading: boolean
  isVideoVisible: boolean
  hasAccessToArtistPage: boolean
  changeVenueModalVisible: boolean

  // Actions
  showReactionModal: () => void
  hideReactionModal: () => void
  hideChroniclesWritersModal: () => void
  showOfferArtistsModal: () => void
  hideOfferArtistsModal: () => void
  hideShareOfferModal: () => void
  submitReaction: ({ offerId, reactionType }: SubmitReactionArgs) => void
  showRecommendations: () => void
  openChroniclesWritersModal: () => void
  acceptVideoCookies: () => void
  openPreview: (index?: number) => void
  addFavorite: UseMutateFunction<
    FavoriteResponse,
    Error | ApiError,
    FavoriteRequest,
    FavoriteMutationContext
  >
  removeFavorite: UseMutateFunction<EmptyResponse, Error, number, FavoriteMutationContext>
  openChronicle: (id: number) => void
  logSeeAllChronicles: () => void
  trackViewableItems: (
    items: Pick<ViewToken, 'key' | 'index'>[],
    moduleId: string,
    itemType: 'offer' | 'venue' | 'artist' | 'unknown',
    playlistIndex?: number
  ) => void
  goBack: () => void
  pressShareOffer: () => void
  openVideoPlayer: () => void
  toggleFavorite: () => void
  toggleReminder: () => void
  logSocialShare: (social: Social | 'Other') => void
  getDisplayedOfferPrice: (item: Offer) => string
  openArtistPage: () => void
  openCookiesSettings: () => void
  logConsultVideo: () => void
  openVenuePage: () => void
  logConsultItinerary: () => void
  hideChangeVenueModal: () => void
  openChangeVenueModal: () => Promise<void>
  selectNewVenueOffer: (nextOfferId: number) => void
}

export const useOfferPageViewModel = (): OfferPageViewModel => {
  const route = useRoute<UseRouteType<'Offer'>>()
  const { navigate } = useNavigation<UseNavigationType>()
  const { goBack } = useGoBack(...getSearchHookConfig('SearchLanding'))
  const offerId = route.params?.id
  const apiRecoParams: RecommendationApiParams = route.params?.apiRecoParams
    ? JSON.parse(route.params?.apiRecoParams)
    : undefined

  const isMultiArtistsEnabled = useFeatureFlag(RemoteStoreFeatureFlags.WIP_OFFER_MULTI_ARTISTS)
  const isVideoSectionEnabled = useFeatureFlag(RemoteStoreFeatureFlags.WIP_OFFER_VIDEO_SECTION)
  const isArtistPageEnabled = useFeatureFlag(RemoteStoreFeatureFlags.WIP_ARTIST_PAGE)

  const { isLoggedIn, user } = useAuthContext()
  const { data: offer, isLoading } = useOfferQuery({
    offerId,
    select: (data) => ({
      ...data,
      reactionsCount: { likes: data.reactionsCount.likes },
    }),
  })
  const showSkeleton = useIsFalseWithDelay(isLoading, ANIMATION_DURATION)
  const { data: subcategories } = useSubcategoriesQuery()
  const subcategoriesMapping = useSubcategoriesMapping()

  const { cookiesConsent, setCookiesConsent } = useCookies()
  const { showErrorSnackBar, showInfoSnackBar } = useSnackBarContext()
  const currency = useGetCurrencyToDisplay()
  const euroToPacificFrancRate = useGetPacificFrancToEuroRate()
  const queryClient = useQueryClient()

  const hasVideoCookiesConsent =
    cookiesConsent.state === ConsentState.HAS_CONSENT &&
    cookiesConsent.value.accepted.includes(CookieNameEnum.VIDEO_PLAYBACK)

  const isVideoVisible = useMemo(() => {
    return !!(offer?.video?.id && isVideoSectionEnabled)
  }, [offer, isVideoSectionEnabled])

  const {
    visible: reactionModalVisible,
    hideModal: hideReactionModal,
    showModal: showReactionModal,
  } = useModal(false)
  const {
    visible: chroniclesWritersModalVisible,
    hideModal: hideChroniclesWritersModal,
    showModal: showChroniclesWritersModal,
  } = useModal(false)
  const {
    visible: offerArtistsModalVisible,
    hideModal: hideOfferArtistsModal,
    showModal: showOfferArtistsModal,
  } = useModal(false)
  const {
    visible: shareOfferModalVisible,
    showModal: showShareOfferModal,
    hideModal: hideShareOfferModal,
  } = useModal(false)
  const favoriteAuthModal = useModal(false)
  const reminderAuthModal = useModal(false)
  const {
    visible: changeVenueModalVisible,
    showModal: showChangeVenueModal,
    hideModal: hideChangeVenueModal,
  } = useModal(false)

  const { data: booking } = useEndedBookingFromOfferIdQuery(
    offer?.id ?? -1,
    isLoggedIn && !!offer?.id
  )
  const { mutate: saveReaction } = useReactionMutation()
  const categoryId = offer?.subcategoryId
    ? subcategoriesMapping[offer?.subcategoryId]?.categoryId
    : ''

  const pageTracking = usePageTracking({
    pageName: 'Offer',
    pageLocation: 'offer',
    pageId: route.params?.id.toString(),
  })

  const submitReaction = useCallback(
    ({ offerId, reactionType }: { offerId: number; reactionType: ReactionTypeEnum }) => {
      saveReaction({ reactions: [{ offerId, reactionType }] })
      hideReactionModal()
    },
    [hideReactionModal, saveReaction]
  )

  const showRecommendations = useCallback(() => {
    void analytics.logClickAllClubRecos({
      offerId: offerId.toString(),
      from: 'offer',
      categoryName: categoryId,
    })
    hideChroniclesWritersModal()
    runAfterInteractionsMobile(() => {
      navigate('ThematicHome', { homeId: '4mlVpAZySUZO6eHazWKZeV', from: 'chronicles' })
    })
  }, [categoryId, hideChroniclesWritersModal, navigate, offerId])

  const openChroniclesWritersModal = useCallback(() => {
    void analytics.logClickWhatsClub({
      offerId: offerId.toString(),
      from: 'offer',
      categoryName: categoryId,
    })
    showChroniclesWritersModal()
  }, [categoryId, offerId, showChroniclesWritersModal])

  const acceptVideoCookies = useCallback(() => {
    const currentConsent = cookiesConsent.value ?? { accepted: [], mandatory: [], refused: [] }

    void setCookiesConsent({
      ...currentConsent,
      accepted: [...currentConsent.accepted, CookieNameEnum.VIDEO_PLAYBACK],
    })
  }, [cookiesConsent.value, setCookiesConsent])

  const openPreview = useCallback(
    (defaultIndex = 0) => {
      if (!offer?.images) return
      navigate('OfferPreview', { id: offer.id, defaultIndex })
    },
    [navigate, offer?.id, offer?.images]
  )

  const selectNewVenueOffer = useCallback(
    (nextOfferId: number) => {
      hideChangeVenueModal()
      triggerConsultOfferLog({
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

  const { data } = useFetchHeadlineOffersCountQuery(offer)

  const subcategory = offer ? subcategoriesMapping[offer.subcategoryId] : undefined
  const chronicleVariantInfo = subcategory ? chronicleVariant[subcategory.id] : undefined

  const chronicles = useMemo(
    () =>
      offer?.chronicles?.map((value) =>
        chroniclePreviewToChronicalCardData(value, chronicleVariantInfo?.subtitleItem ?? '')
      ),
    [chronicleVariantInfo?.subtitleItem, offer?.chronicles]
  )

  const shouldFetchSearchVenueOffers = offer ? isMultiVenueCompatibleOffer(offer) : false
  const headlineOffersCount = shouldFetchSearchVenueOffers ? data?.headlineOffersCount : undefined

  const { mutate: addFavorite, isPending: isAddFavoriteLoading } = useAddFavoriteMutation({
    onSuccess: () => {
      if (typeof offer?.id === 'number' && route.params) {
        const { from, moduleName, moduleId, searchId, playlistType } = route.params
        void analytics.logHasAddedOfferToFavorites({
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

  const favorite = useFavorite({ offerId: offer?.id })

  const openChronicle = useCallback(
    (id: number) => {
      // It's dirty but necessary to use from parameter for the logs
      navigate('Chronicles', { offerId, chronicleId: id, from: 'chronicles' })
      void analytics.logConsultChronicle({ offerId, chronicleId: id })
    },
    [navigate, offerId]
  )

  const logSeeAllChronicles = useCallback(() => {
    void analytics.logClickInfoReview({
      from: 'offer',
      offerId: offerId.toString(),
      categoryName: subcategory ? subcategory.categoryId : '',
      userId: user ? user?.id.toString() : undefined,
    })
  }, [offerId, subcategory, user])

  const trackViewableItems = useCallback(
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
        entryId: offerId.toString(),
      })
    },
    [offerId, pageTracking]
  )

  const { share: shareOffer, shareContent } = getShareOffer({
    offer,
    utmMedium: 'header',
  })

  const pressShareOffer = useCallback(() => {
    void analytics.logShare({ type: 'Offer', from: 'offer', offerId })
    void shareOffer()
    showShareOfferModal()
  }, [offerId, shareOffer, showShareOfferModal])

  const openVideoPlayer = useCallback(() => {
    if (!hasVideoCookiesConsent) {
      showInfoSnackBar({
        message: 'Pour lire la vidéo, tu dois accepter les cookies vidéo...',
        timeout: SNACK_BAR_TIME_OUT,
      })
      return
    }
    navigate('OfferVideoPreview', { id: offerId })
  }, [hasVideoCookiesConsent, navigate, offerId, showInfoSnackBar])

  const { data: reminder } = useGetRemindersQuery((data) => selectReminderByOfferId(data, offerId))

  const { mutate: addReminder } = useAddReminderMutation({
    onError: () => {
      showErrorSnackBar({
        message: 'L’offre n’a pas pu être ajoutée à tes rappels',
        timeout: SNACK_BAR_TIME_OUT,
      })
    },
  })

  const { mutate: deleteReminder } = useDeleteReminderMutation({
    onError: () => {
      showErrorSnackBar({
        message: 'L’offre n’a pas pu être retirée de tes rappels',
        timeout: SNACK_BAR_TIME_OUT,
      })
    },
  })

  const toggleFavorite = useCallback(() => {
    if (!isLoggedIn) return favoriteAuthModal.showModal()
    return favorite ? removeFavorite(favorite.id) : addFavorite({ offerId })
  }, [addFavorite, favorite, favoriteAuthModal, isLoggedIn, offerId, removeFavorite])

  const toggleReminder = useCallback(() => {
    if (!isLoggedIn) return reminderAuthModal.showModal()
    return reminder ? deleteReminder(reminder.id) : addReminder(offerId)
  }, [addReminder, deleteReminder, isLoggedIn, offerId, reminder, reminderAuthModal])

  const logSocialShare = useCallback(
    async (social: Social | 'Other') => {
      await analytics.logShare({ type: 'Offer', offerId, from: 'offer', social })
    },
    [offerId]
  )

  const logConsultVideo = useCallback(async () => {
    await analytics.logConsultVideo({ from: 'offer', offerId: offerId.toString() })
  }, [offerId])

  const logConsultItinerary = useCallback(async () => {
    await analytics.logConsultItinerary({ offerId, from: 'offer' })
  }, [offerId])

  const getDisplayedOfferPrice = useCallback(
    (item: Offer) => {
      return getDisplayedPrice(
        item.offer.prices,
        currency,
        euroToPacificFrancRate,
        getIfPricesShouldBeFixed(item.offer.subcategoryId) ? undefined : formatStartPrice
      )
    },
    [currency, euroToPacificFrancRate]
  )

  const openArtistPage = useCallback(() => {
    if (!offer?.artists[0]) return

    if (offer.artists.length === 1) {
      void analytics.logConsultArtist({
        offerId: offer.id.toString(),
        artistId: offer.artists[0].id,
        artistName: offer.artists[0].name,
        from: 'offer',
      })
      navigate('Artist', { id: offer.artists[0].id })
      return
    }

    showOfferArtistsModal()
  }, [navigate, offer?.artists, offer?.id, showOfferArtistsModal])

  const openCookiesSettings = useCallback(() => {
    navigate('ProfileStackNavigator', { screen: 'ConsentSettings', params: { offerId } })
  }, [navigate, offerId])

  const openVenuePage = useCallback(() => {
    if (!offer?.venue.isPermanent) return

    queryClient.setQueryData([QueryKeys.VENUE, offer.venue.id], mergeVenueData(offer.venue))

    void analytics.logConsultVenue({
      venueId: offer.venue.id.toString(),
      from: 'offer',
    })

    navigate('Venue', { id: offer.venue.id })
  }, [navigate, offer?.venue, queryClient])

  const openChangeVenueModal = useCallback(async () => {
    showChangeVenueModal()
    await analytics.logMultivenueOptionDisplayed(offerId)
  }, [offerId, showChangeVenueModal])

  // We want to show images from offer when it's loaded. Not the one preloaded in query cache...
  const images: ImageWithCredit[] = useMemo(
    () =>
      offer && offer.metadata && offer.images
        ? getImagesUrlsWithCredit<ImageWithCredit>(offer.images)
        : [],
    [offer]
  )

  const cachedOffer = queryClient.getQueryData<OfferResponseV2>([QueryKeys.OFFER, offer?.id])
  // Extract cached image before it's been updated by next offer query
  const placeholderImage = cachedOffer?.images?.recto?.url

  const imageDimensions = useOfferImageContainerDimensions(offer?.subcategoryId)

  const hasAccessToArtistPage = isMultiArtistsEnabled
    ? isArtistPageEnabled
    : isArtistPageEnabled && offer?.artists.length === 1

  useEffect(() => {
    if (route?.params.from === 'deeplink') {
      triggerConsultOfferLog({ offerId: route.params.id, from: 'deeplink' })
    }
  }, [isVideoSectionEnabled, route.params])

  return {
    offer,
    user,
    subcategories,
    booking,
    subcategory,
    chronicleVariantInfo,
    chronicles,
    headlineOffersCount,
    favorite,
    images,
    placeholderImage,
    imageDimensions,
    shareContent,
    showSkeleton,
    hasVideoCookiesConsent,
    reactionModalVisible,
    chroniclesWritersModalVisible,
    offerArtistsModalVisible,
    shareOfferModalVisible,
    isMultiArtistsEnabled,
    isAddFavoriteLoading,
    isRemoveFavoriteLoading,
    isVideoVisible,
    hasAccessToArtistPage,
    changeVenueModalVisible,
    showReactionModal,
    hideReactionModal,
    hideChroniclesWritersModal,
    showOfferArtistsModal,
    hideOfferArtistsModal,
    hideShareOfferModal,
    submitReaction,
    showRecommendations,
    openChroniclesWritersModal,
    acceptVideoCookies,
    openPreview,
    addFavorite,
    removeFavorite,
    openChronicle,
    logSeeAllChronicles,
    trackViewableItems,
    goBack,
    pressShareOffer,
    openVideoPlayer,
    toggleFavorite,
    toggleReminder,
    logSocialShare,
    getDisplayedOfferPrice,
    openArtistPage,
    openCookiesSettings,
    logConsultVideo,
    openVenuePage,
    logConsultItinerary,
    hideChangeVenueModal,
    openChangeVenueModal,
    selectNewVenueOffer,
  }
}
