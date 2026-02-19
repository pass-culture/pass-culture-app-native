import React, { FunctionComponent } from 'react'

import { BookingListItemResponse, ReactionTypeEnum } from 'api/gen'
import { SmallBadgedButton } from 'features/bookings/components/SmallBadgedButton'
import { useReactionIcon } from 'features/bookings/helpers/useReactionIcon/useReactionIcon'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Button } from 'ui/designSystem/Button/Button'
import { Share } from 'ui/svg/icons/Share'

type Props = {
  booking: BookingListItemResponse
  handlePressShareOffer: VoidFunction
  handleShowReactionModal: VoidFunction
}

export const EndedBookingInteractionButtons: FunctionComponent<Props> = ({
  booking,
  handlePressShareOffer,
  handleShowReactionModal,
}) => {
  const { stock, userReaction, canReact } = booking

  const ReactionIcon = useReactionIcon(userReaction)

  const getReactionButtonAccessibilityLabel = (reaction?: ReactionTypeEnum | null) => {
    const additionalInfoMap: Record<ReactionTypeEnum, string> = {
      LIKE: '(tu as liké)',
      DISLIKE: '(tu as disliké)',
      NO_REACTION: '(tu n’as pas souhaité réagir)',
    }

    return ['Réagis à ta réservation']
      .concat(reaction ? [additionalInfoMap[reaction]] : [])
      .join(' ')
  }

  const ReactionButton = userReaction === null ? SmallBadgedButton : Button

  return (
    <ViewGap gap={4}>
      <Button
        iconButton
        icon={Share}
        onPress={handlePressShareOffer}
        accessibilityLabel={`Partager l’offre ${stock.offer.name}`}
        variant="secondary"
        color="neutral"
      />

      {canReact ? (
        <ReactionButton
          iconButton
          icon={ReactionIcon}
          onPress={handleShowReactionModal}
          accessibilityLabel={getReactionButtonAccessibilityLabel(userReaction)}
          variant="secondary"
          color="neutral"
        />
      ) : null}
    </ViewGap>
  )
}
