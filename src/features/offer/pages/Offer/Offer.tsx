import { useRoute } from '@react-navigation/native'
import React, { useCallback } from 'react'

import { ReactionTypeEnum } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { chroniclePreviewToChronicalCardData } from 'features/offer/adapters/chroniclePreviewToChronicleCardData'
import { OfferContent } from 'features/offer/components/OfferContent/OfferContent'
import { OfferContentPlaceholder } from 'features/offer/components/OfferContentPlaceholder/OfferContentPlaceholder'
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
  const offerId = route.params?.id

  const hasOfferChronicleSection = useFeatureFlag(
    RemoteStoreFeatureFlags.WIP_OFFER_CHRONICLE_SECTION
  )
  const isReactionEnabled = useFeatureFlag(RemoteStoreFeatureFlags.WIP_REACTION_FEATURE)
  const isVideoSectionEnabled = useFeatureFlag(RemoteStoreFeatureFlags.WIP_OFFER_VIDEO_SECTION)

  const { isLoggedIn } = useAuthContext()
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
    enabled: isLoggedIn && isReactionEnabled && !!offer?.id,
  })
  const { mutate: saveReaction } = useReactionMutation()

  const videoData = isVideoSectionEnabled
    ? {
        videoId: 'hCqdTGWspes',
        thumbnailUri:
          'https://rukminim2.flixcart.com/image/750/900/kgcl7680-0/poster/0/o/c/medium-sa-503-cartoon-sticker-poster-peppa-pig-wall-poster-original-imafwhuqjgjjtucs.jpeg?q=90&crop=false',
      }
    : undefined

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

  const { data } = useFetchHeadlineOffersCountQuery(offer)

  if (!offer || !subcategories || !subcategoriesMapping?.[offer?.subcategoryId]) return null

  const shouldFetchSearchVenueOffers = isMultiVenueCompatibleOffer(offer)
  const headlineOffersCount = shouldFetchSearchVenueOffers ? data?.headlineOffersCount : undefined

  if (showSkeleton) return <OfferContentPlaceholder />

  return (
    <Page>
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
        headlineOffersCount={headlineOffersCount}
        searchGroupList={subcategories.searchGroups}
        subcategory={subcategoriesMapping[offer.subcategoryId]}
        defaultReaction={booking?.userReaction}
        videoData={videoData}
        onReactionButtonPress={booking?.canReact ? showModal : undefined}
      />
    </Page>
  )
}
