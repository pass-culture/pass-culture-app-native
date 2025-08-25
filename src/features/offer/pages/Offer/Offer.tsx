import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useCallback } from 'react'

import { ReactionTypeEnum } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { ChroniclesWritersModal } from 'features/chronicle/pages/ChroniclesWritersModal/ChroniclesWritersModal'
import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator/types'
import { chroniclePreviewToChronicalCardData } from 'features/offer/adapters/chroniclePreviewToChronicleCardData'
import { OfferContent } from 'features/offer/components/OfferContent/OfferContent'
import { OfferContentPlaceholder } from 'features/offer/components/OfferContentPlaceholder/OfferContentPlaceholder'
import { chronicleVariant } from 'features/offer/helpers/chronicleVariant/chronicleVariant'
import { useFetchHeadlineOffersCountQuery } from 'features/offer/queries/useFetchHeadlineOffersCountQuery'
import { ReactionChoiceModal } from 'features/reactions/components/ReactionChoiceModal/ReactionChoiceModal'
import { ReactionChoiceModalBodyEnum, ReactionFromEnum } from 'features/reactions/enum'
import { useReactionMutation } from 'features/reactions/queries/useReactionMutation'
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

  const { isLoggedIn, user } = useAuthContext()
  const { data: offer, isInitialLoading: isLoading } = useOfferQuery({
    offerId,
    select: (data) => ({
      ...data,
      reactionsCount: { likes: isReactionEnabled ? data.reactionsCount.likes : 0 },
    }),
  })
  const showSkeleton = useIsFalseWithDelay(isLoading, ANIMATION_DURATION)
  const { data: subcategories } = useSubcategories()
  const subcategoriesMapping = useSubcategoriesMapping()

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
  const { data: booking } = useEndedBookingFromOfferIdQuery(offer?.id ?? -1, {
    enabled: isLoggedIn && isReactionEnabled && !!offer?.id,
  })
  const { mutate: saveReaction } = useReactionMutation()

  const handleSaveReaction = useCallback(
    ({ offerId, reactionType }: { offerId: number; reactionType: ReactionTypeEnum }) => {
      saveReaction({ reactions: [{ offerId, reactionType }] })
      hideReactionModal()
    },
    [hideReactionModal, saveReaction]
  )

  const handleOnShowRecoButtonPress = () => {
    hideChroniclesWritersModal()
    navigate('ThematicHome', { homeId: '4mlVpAZySUZO6eHazWKZeV', from: 'chronicles' })
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

      <ChroniclesWritersModal
        closeModal={hideChroniclesWritersModal}
        isVisible={chroniclesWritersModalVisible}
        onShowRecoButtonPress={handleOnShowRecoButtonPress}
        variantInfo={chronicleVariantInfo}
      />

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
        onShowChroniclesWritersModal={showChroniclesWritersModal}
      />
    </Page>
  )
}
