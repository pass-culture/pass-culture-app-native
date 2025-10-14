import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import React, { useCallback } from 'react'
import { InteractionManager } from 'react-native'

import { ReactionTypeEnum } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { ChroniclesWritersModal } from 'features/chronicle/pages/ChroniclesWritersModal/ChroniclesWritersModal'
import { ConsentState, CookieNameEnum } from 'features/cookies/enums'
import { useCookies } from 'features/cookies/helpers/useCookies'
import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator/types'
import { chroniclePreviewToChronicalCardData } from 'features/offer/adapters/chroniclePreviewToChronicleCardData'
import { OfferContent } from 'features/offer/components/OfferContent/OfferContent'
import { OfferContentPlaceholder } from 'features/offer/components/OfferContentPlaceholder/OfferContentPlaceholder'
import { chronicleVariant } from 'features/offer/helpers/chronicleVariant/chronicleVariant'
import { useFetchHeadlineOffersCountQuery } from 'features/offer/queries/useFetchHeadlineOffersCountQuery'
import { ReactionChoiceModal } from 'features/reactions/components/ReactionChoiceModal/ReactionChoiceModal'
import { ReactionChoiceModalBodyEnum, ReactionFromEnum } from 'features/reactions/enum'
import { useReactionMutation } from 'features/reactions/queries/useReactionMutation'
import { analytics } from 'libs/analytics/provider'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useIsFalseWithDelay } from 'libs/hooks/useIsFalseWithDelay'
import { useSubcategoriesMapping } from 'libs/subcategories/mappings'
import { useSubcategories } from 'libs/subcategories/useSubcategories'
import { useEndedBookingFromOfferIdQuery } from 'queries/bookings'
import { useOfferQuery } from 'queries/offer/useOfferQuery'
import { isMultiVenueCompatibleOffer } from 'shared/multiVenueOffer/isMultiVenueCompatibleOffer'
import { useModal } from 'ui/components/modals/useModal'
import { Page } from 'ui/pages/Page'

const ANIMATION_DURATION = 700

export function Offer() {
  const route = useRoute<UseRouteType<'Offer'>>()
  const { navigate } = useNavigation<UseNavigationType>()
  const offerId = route.params?.id

  const hasOfferChronicleSection = useFeatureFlag(
    RemoteStoreFeatureFlags.WIP_OFFER_CHRONICLE_SECTION
  )
  const isReactionEnabled = useFeatureFlag(RemoteStoreFeatureFlags.WIP_REACTION_FEATURE)
  const shouldUseVideoCookies = useFeatureFlag(RemoteStoreFeatureFlags.WIP_VIDEO_COOKIES_CONSENT)

  const { isLoggedIn, user } = useAuthContext()
  const { data: offer, isLoading } = useOfferQuery({
    offerId,
    select: (data) => ({
      ...data,
      reactionsCount: { likes: isReactionEnabled ? data.reactionsCount.likes : 0 },
    }),
  })
  const showSkeleton = useIsFalseWithDelay(isLoading, ANIMATION_DURATION)
  const { data: subcategories } = useSubcategories()
  const subcategoriesMapping = useSubcategoriesMapping()
  const { cookiesConsent, loadCookiesConsent } = useCookies()

  // To reload cookies at each screen display
  useFocusEffect(
    useCallback(() => {
      loadCookiesConsent()
    }, [loadCookiesConsent])
  )

  const hasVideoCookiesConsent = shouldUseVideoCookies
    ? cookiesConsent.state === ConsentState.HAS_CONSENT &&
      cookiesConsent.value.accepted.includes(CookieNameEnum.VIDEO_PLAYBACK)
    : true

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
  const { data: booking } = useEndedBookingFromOfferIdQuery(
    offer?.id ?? -1,
    isLoggedIn && isReactionEnabled && !!offer?.id
  )
  const { mutate: saveReaction } = useReactionMutation()
  const categoryId = offer?.subcategoryId
    ? subcategoriesMapping[offer?.subcategoryId]?.categoryId
    : ''

  const handleSaveReaction = useCallback(
    ({ offerId, reactionType }: { offerId: number; reactionType: ReactionTypeEnum }) => {
      saveReaction({ reactions: [{ offerId, reactionType }] })
      hideReactionModal()
    },
    [hideReactionModal, saveReaction]
  )

  const handleOnShowRecoButtonPress = () => {
    analytics.logClickAllClubRecos({
      offerId: offerId.toString(),
      from: 'offer',
      categoryName: categoryId,
    })
    hideChroniclesWritersModal()
    InteractionManager.runAfterInteractions(() => {
      navigate('ThematicHome', { homeId: '4mlVpAZySUZO6eHazWKZeV', from: 'chronicles' })
    })
  }

  const handleOnShowChroniclesWritersModal = () => {
    analytics.logClickWhatsClub({
      offerId: offerId.toString(),
      from: 'offer',
      categoryName: categoryId,
    })
    showChroniclesWritersModal()
  }

  const { data } = useFetchHeadlineOffersCountQuery(offer)

  if (!offer || !subcategories || !subcategoriesMapping?.[offer?.subcategoryId]) return null

  const subcategory = subcategoriesMapping[offer?.subcategoryId]
  const chronicleVariantInfo = chronicleVariant[subcategory.id]

  const chronicles = hasOfferChronicleSection
    ? offer?.chronicles?.map((value) =>
        chroniclePreviewToChronicalCardData(value, chronicleVariantInfo.subtitleItem)
      )
    : undefined

  const shouldFetchSearchVenueOffers = isMultiVenueCompatibleOffer(offer)
  const headlineOffersCount = shouldFetchSearchVenueOffers ? data?.headlineOffersCount : undefined

  if (showSkeleton) return <OfferContentPlaceholder />

  return (
    <Page>
      <ReactionChoiceModal
        dateUsed={booking?.dateUsed ?? ''}
        offer={offer}
        closeModal={hideReactionModal}
        visible={reactionModalVisible}
        defaultReaction={booking?.userReaction}
        onSave={handleSaveReaction}
        from={ReactionFromEnum.ENDED_BOOKING}
        bodyType={ReactionChoiceModalBodyEnum.VALIDATION}
      />

      {chronicleVariantInfo ? (
        <ChroniclesWritersModal
          closeModal={hideChroniclesWritersModal}
          isVisible={chroniclesWritersModalVisible}
          onShowRecoButtonPress={handleOnShowRecoButtonPress}
          variantInfo={chronicleVariantInfo}
        />
      ) : null}

      <OfferContent
        offer={offer}
        chronicles={chronicles}
        chronicleVariantInfo={chronicleVariantInfo}
        headlineOffersCount={headlineOffersCount}
        searchGroupList={subcategories.searchGroups}
        subcategory={subcategoriesMapping[offer.subcategoryId]}
        defaultReaction={booking?.userReaction}
        onReactionButtonPress={booking?.canReact ? showReactionModal : undefined}
        userId={user?.id}
        onShowChroniclesWritersModal={handleOnShowChroniclesWritersModal}
        hasVideoCookiesConsent={hasVideoCookiesConsent}
      />
    </Page>
  )
}
