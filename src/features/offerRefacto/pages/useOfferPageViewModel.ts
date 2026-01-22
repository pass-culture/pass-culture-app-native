import { useNavigation, useRoute } from '@react-navigation/native'
import { useCallback } from 'react'

import {
  BookingReponse,
  OfferResponseV2,
  ReactionTypeEnum,
  SubcategoriesResponseModelv2,
  SubcategoryResponseModelv2,
} from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { ChronicleCardData } from 'features/chronicle/type'
import { ConsentState, CookieNameEnum } from 'features/cookies/enums'
import { useCookies } from 'features/cookies/helpers/useCookies'
import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator/types'
import { chroniclePreviewToChronicalCardData } from 'features/offer/adapters/chroniclePreviewToChronicleCardData'
import { ChronicleVariantInfo } from 'features/offer/components/OfferContent/ChronicleSection/types'
import { chronicleVariant } from 'features/offer/helpers/chronicleVariant/chronicleVariant'
import { useFetchHeadlineOffersCountQuery } from 'features/offer/queries/useFetchHeadlineOffersCountQuery'
import { ANIMATION_DURATION } from 'features/offerRefacto/constants'
import { useReactionMutation } from 'features/reactions/queries/useReactionMutation'
import { UserProfileResponseWithoutSurvey } from 'features/share/types'
import { analytics } from 'libs/analytics/provider'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useIsFalseWithDelay } from 'libs/hooks/useIsFalseWithDelay'
import { useSubcategoriesMapping } from 'libs/subcategories/mappings'
import { useEndedBookingFromOfferIdQuery } from 'queries/bookings'
import { useOfferQuery } from 'queries/offer/useOfferQuery'
import { useSubcategoriesQuery } from 'queries/subcategories/useSubcategoriesQuery'
import { isMultiVenueCompatibleOffer } from 'shared/multiVenueOffer/isMultiVenueCompatibleOffer'
import { runAfterInteractionsMobile } from 'shared/runAfterInteractionsMobile/runAfterInteractionsMobile'
import { useModal } from 'ui/components/modals/useModal'

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

  // UI state
  showSkeleton: boolean
  hasVideoCookiesConsent: boolean
  reactionModalVisible: boolean
  chroniclesWritersModalVisible: boolean
  offerArtistsModalVisible: boolean
  isMultiArtistsEnabled?: boolean

  // Actions
  showReactionModal: () => void
  hideReactionModal: () => void
  hideChroniclesWritersModal: () => void
  showOfferArtistsModal: () => void
  hideOfferArtistsModal: () => void
  submitReaction: ({ offerId, reactionType }: SubmitReactionArgs) => void
  showRecommendations: () => void
  openChroniclesWritersModal: () => void
  acceptVideoCookies: () => void
}

export const useOfferPageViewModel = (): OfferPageViewModel => {
  const route = useRoute<UseRouteType<'Offer'>>()
  const { navigate } = useNavigation<UseNavigationType>()
  const offerId = route.params?.id

  const isMultiArtistsEnabled = useFeatureFlag(RemoteStoreFeatureFlags.WIP_OFFER_MULTI_ARTISTS)

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

  const hasVideoCookiesConsent =
    cookiesConsent.state === ConsentState.HAS_CONSENT &&
    cookiesConsent.value.accepted.includes(CookieNameEnum.VIDEO_PLAYBACK)

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
  const { data: booking } = useEndedBookingFromOfferIdQuery(
    offer?.id ?? -1,
    isLoggedIn && !!offer?.id
  )
  const { mutate: saveReaction } = useReactionMutation()
  const categoryId = offer?.subcategoryId
    ? subcategoriesMapping[offer?.subcategoryId]?.categoryId
    : ''

  const submitReaction = useCallback(
    ({ offerId, reactionType }: { offerId: number; reactionType: ReactionTypeEnum }) => {
      saveReaction({ reactions: [{ offerId, reactionType }] })
      hideReactionModal()
    },
    [hideReactionModal, saveReaction]
  )

  const showRecommendations = () => {
    void analytics.logClickAllClubRecos({
      offerId: offerId.toString(),
      from: 'offer',
      categoryName: categoryId,
    })
    hideChroniclesWritersModal()
    runAfterInteractionsMobile(() => {
      navigate('ThematicHome', { homeId: '4mlVpAZySUZO6eHazWKZeV', from: 'chronicles' })
    })
  }

  const openChroniclesWritersModal = () => {
    void analytics.logClickWhatsClub({
      offerId: offerId.toString(),
      from: 'offer',
      categoryName: categoryId,
    })
    showChroniclesWritersModal()
  }

  const acceptVideoCookies = () => {
    const currentConsent = cookiesConsent.value ?? { accepted: [], mandatory: [], refused: [] }

    void setCookiesConsent({
      ...currentConsent,
      accepted: [...currentConsent.accepted, CookieNameEnum.VIDEO_PLAYBACK],
    })
  }

  const { data } = useFetchHeadlineOffersCountQuery(offer)

  const subcategory = offer ? subcategoriesMapping[offer.subcategoryId] : undefined
  const chronicleVariantInfo = subcategory ? chronicleVariant[subcategory.id] : undefined

  const chronicles = offer?.chronicles?.map((value) =>
    chroniclePreviewToChronicalCardData(value, chronicleVariantInfo?.subtitleItem ?? '')
  )

  const shouldFetchSearchVenueOffers = offer ? isMultiVenueCompatibleOffer(offer) : false
  const headlineOffersCount = shouldFetchSearchVenueOffers ? data?.headlineOffersCount : undefined

  return {
    offer,
    user,
    subcategories,
    booking,
    subcategory,
    chronicleVariantInfo,
    chronicles,
    headlineOffersCount,
    showSkeleton,
    hasVideoCookiesConsent,
    reactionModalVisible,
    chroniclesWritersModalVisible,
    offerArtistsModalVisible,
    isMultiArtistsEnabled,
    showReactionModal,
    hideReactionModal,
    hideChroniclesWritersModal,
    showOfferArtistsModal,
    hideOfferArtistsModal,
    submitReaction,
    showRecommendations,
    openChroniclesWritersModal,
    acceptVideoCookies,
  }
}
