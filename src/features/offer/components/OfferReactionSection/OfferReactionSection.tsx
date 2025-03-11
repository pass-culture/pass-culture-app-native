import React, { FunctionComponent, useCallback, useMemo } from 'react'
import styled from 'styled-components/native'

import { OfferResponseV2, PostReactionRequest, ReactionTypeEnum } from 'api/gen'
import { InfoCounter } from 'features/offer/components/InfoCounter/InfoCounter'
import { useReactionMutation } from 'features/reactions/api/useReactionMutation'
import { ReactionChoiceValidation } from 'features/reactions/components/ReactionChoiceValidation/ReactionChoiceValidation'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useBookingsQuery } from 'queries/bookings/useBookingsQuery'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { BookClubCertification } from 'ui/svg/BookClubCertification'
import { ThumbUpFilled } from 'ui/svg/icons/ThumbUpFilled'

type Props = {
  offer: OfferResponseV2
}

export const OfferReactionSection: FunctionComponent<Props> = ({ offer }) => {
  const isReactionFeatureActive = useFeatureFlag(RemoteStoreFeatureFlags.WIP_REACTION_FEATURE)
  const { data: bookings } = useBookingsQuery()
  const { mutate: addReaction } = useReactionMutation()

  const userBooking = useMemo(
    () => bookings?.ended_bookings?.find((booking) => booking.stock.offer.id === offer.id),
    [bookings, offer.id]
  )

  const hasLikes = offer.reactionsCount.likes > 0
  const hasChronicles = offer.chronicles.length > 0
  const shouldDisplayReactions = hasLikes || hasChronicles
  const canDisplayReactionSection =
    isReactionFeatureActive && (shouldDisplayReactions || userBooking?.canReact)

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

  const likesCounterElement = hasLikes ? (
    <LikesInfoCounter text={`${offer.reactionsCount.likes} j’aime`} />
  ) : null
  const chroniclesCounterElement = hasChronicles ? (
    <ChroniclesInfoCounter text={`${offer.chronicles.length} avis`} />
  ) : null

  if (!canDisplayReactionSection) return null

  return (
    <ViewGap gap={4}>
      {shouldDisplayReactions ? (
        <InfosCounterContainer gap={2}>
          {likesCounterElement}
          {chroniclesCounterElement}
        </InfosCounterContainer>
      ) : null}

      {userBooking?.canReact ? (
        <ReactionChoiceValidation
          handleOnPressReactionButton={handleSaveReaction}
          reactionStatus={userBooking?.userReaction}
        />
      ) : null}
    </ViewGap>
  )
}

const InfosCounterContainer = styled(ViewGap)({
  flexDirection: 'row',
})

const ThumbUpIcon = styled(ThumbUpFilled).attrs(({ theme }) => ({
  size: theme.icons.sizes.small,
  color: theme.colors.primary,
}))``

const BookClubIcon = styled(BookClubCertification).attrs(({ theme }) => ({
  size: theme.icons.sizes.small,
}))``

const LikesInfoCounter = styled(InfoCounter).attrs(() => ({
  icon: <ThumbUpIcon testID="likesCounterIcon" />,
}))``

const ChroniclesInfoCounter = styled(InfoCounter).attrs(() => ({
  icon: <BookClubIcon testID="chroniclesCounterIcon" />,
}))``
