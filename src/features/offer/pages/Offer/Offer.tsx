import { useRoute } from '@react-navigation/native'
import React, { Fragment, useCallback } from 'react'

import { ReactionTypeEnum } from 'api/gen'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { chroniclePreviewToChronicalCardData } from 'features/offer/adapters/chroniclePreviewToChronicleCardData'
import { OfferContent } from 'features/offer/components/OfferContent/OfferContent'
import { OfferContentPlaceholder } from 'features/offer/components/OfferContentPlaceholder/OfferContentPlaceholder'
import { useReactionMutation } from 'features/reactions/api/useReactionMutation'
import { ReactionChoiceModal } from 'features/reactions/components/ReactionChoiceModal/ReactionChoiceModal'
import { ReactionChoiceModalBodyEnum, ReactionFromEnum } from 'features/reactions/enum'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useIsFalseWithDelay } from 'libs/hooks/useIsFalseWithDelay'
import { useSubcategoriesMapping } from 'libs/subcategories/mappings'
import { useSubcategories } from 'libs/subcategories/useSubcategories'
import { useEndedBookingFromOfferIdQuery } from 'queries/bookings/useEndedBookingFromOfferIdQuery'
import { useOfferQuery } from 'queries/offer/useOfferQuery'
import { useModal } from 'ui/components/modals/useModal'

const ANIMATION_DURATION = 700

export function Offer() {
  const route = useRoute<UseRouteType<'Offer'>>()
  const offerId = route.params?.id

  const hasOfferChronicleSection = useFeatureFlag(
    RemoteStoreFeatureFlags.WIP_OFFER_CHRONICLE_SECTION
  )
  const isReactionEnabled = useFeatureFlag(RemoteStoreFeatureFlags.WIP_REACTION_FEATURE)

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

  const { visible, hideModal, showModal } = useModal(false)
  const { data: booking } = useEndedBookingFromOfferIdQuery(offer?.id ?? -1, {
    enabled: isReactionEnabled && !!offer?.id,
  })
  const { mutate: saveReaction } = useReactionMutation()

  const handleSaveReaction = useCallback(
    ({ offerId, reactionType }: { offerId: number; reactionType: ReactionTypeEnum }) => {
      saveReaction({ reactions: [{ offerId, reactionType }] })
      hideModal()
    },
    [hideModal, saveReaction]
  )

  const chronicles = hasOfferChronicleSection
    ? offer?.chronicles?.map((value) => chroniclePreviewToChronicalCardData(value))
    : undefined

  if (!offer || !subcategories) return null

  if (showSkeleton) return <OfferContentPlaceholder />

  return (
    <Fragment>
      <ReactionChoiceModal
        dateUsed={booking?.dateUsed ?? ''}
        offer={offer}
        closeModal={hideModal}
        visible={visible}
        defaultReaction={booking?.userReaction}
        onSave={handleSaveReaction}
        from={ReactionFromEnum.ENDED_BOOKING}
        bodyType={ReactionChoiceModalBodyEnum.VALIDATION}
      />

      <OfferContent
        offer={offer}
        chronicles={chronicles}
        searchGroupList={subcategories.searchGroups}
        subcategory={subcategoriesMapping[offer.subcategoryId]}
        defaultReaction={booking?.userReaction}
        onReactionButtonPress={booking ? showModal : undefined}
      />
    </Fragment>
  )
}
