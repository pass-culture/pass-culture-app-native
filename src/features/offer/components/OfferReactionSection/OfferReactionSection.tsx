import React, { FunctionComponent, useCallback, useMemo } from 'react'

import { OfferResponseV2, PostReactionRequest, ReactionTypeEnum } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { useBookings } from 'features/bookings/api'
import { OfferReactions } from 'features/offer/components/OfferReactions/OfferReactions'
import { useReactionMutation } from 'features/reactions/api/useReactionMutation'
import { ReactionChoiceValidation } from 'features/reactions/components/ReactionChoiceValidation/ReactionChoiceValidation'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useRemoteConfigContext } from 'libs/firebase/remoteConfig/RemoteConfigProvider'
import { Subcategory } from 'libs/subcategories/types'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'

type Props = {
  offer: OfferResponseV2
  subcategory: Subcategory
}

export const OfferReactionSection: FunctionComponent<Props> = ({ offer, subcategory }) => {
  const isReactionFeatureActive = useFeatureFlag(RemoteStoreFeatureFlags.WIP_REACTION_FEATURE)
  const { reactionCategories } = useRemoteConfigContext()
  const { isLoggedIn, user } = useAuthContext()
  const { data: bookings } = useBookings()
  const { mutate: addReaction } = useReactionMutation()

  const userBooking = useMemo(
    () =>
      bookings?.ended_bookings?.find(
        (booking) => booking.stock.offer.id === offer.id && !booking.cancellationDate
      ),
    [bookings, offer.id]
  )

  const shouldDisplayReactionButtons =
    isLoggedIn &&
    user?.isBeneficiary &&
    reactionCategories.categories.includes(subcategory.nativeCategoryId) &&
    !!userBooking

  const canDisplayReactionSection =
    isReactionFeatureActive && (offer.reactionsCount.likes > 0 || shouldDisplayReactionButtons)

  const handleSaveReaction = useCallback(
    (reactionType: ReactionTypeEnum) => {
      const currentReactionType =
        reactionType === userBooking?.userReaction ? ReactionTypeEnum.NO_REACTION : reactionType

      const reactionRequest: PostReactionRequest = {
        reactions: [{ offerId: offer.id, reactionType: currentReactionType }],
      }

      addReaction(reactionRequest)
      return Promise.resolve(true)
    },
    [addReaction, offer.id, userBooking?.userReaction]
  )

  if (!canDisplayReactionSection) return null

  return (
    <ViewGap gap={4}>
      <OfferReactions
        user={user}
        isLoggedIn={isLoggedIn}
        offer={offer}
        userCanReact={shouldDisplayReactionButtons}
        userBooking={userBooking}
      />

      {shouldDisplayReactionButtons ? (
        <ReactionChoiceValidation
          handleOnPressReactionButton={handleSaveReaction}
          reactionStatus={userBooking?.userReaction}
        />
      ) : null}
    </ViewGap>
  )
}
