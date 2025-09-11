import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { BookingResponse, ReactionTypeEnum } from 'api/gen'
import { SmallBadgedButton } from 'features/bookings/components/SmallBadgedButton'
import { useReactionIcon } from 'features/bookings/helpers/useReactionIcon/useReactionIcon'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { RoundedButton } from 'ui/components/buttons/RoundedButton'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'

type Props = {
  booking: BookingResponse
  handlePressShareOffer: VoidFunction
  handleShowReactionModal: VoidFunction
}

export const EndedBookingInteractionButtons: FunctionComponent<Props> = ({
  booking,
  handlePressShareOffer,
  handleShowReactionModal,
}) => {
  const { stock, userReaction, canReact } = booking
  const shouldDisplayReactionFeature = useFeatureFlag(RemoteStoreFeatureFlags.WIP_REACTION_FEATURE)

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

  const ReactionButton = userReaction === null ? SmallBadgedButton : RoundedButton

  return (
    <ViewGap gap={4}>
      <ShareContainer>
        <RoundedButton
          iconName="share"
          onPress={handlePressShareOffer}
          accessibilityLabel={`Partager l’offre ${stock.offer.name}`}
        />
      </ShareContainer>
      {canReact && shouldDisplayReactionFeature ? (
        <ReactionContainer>
          <ReactionButton
            iconName="like"
            Icon={ReactionIcon}
            onPress={handleShowReactionModal}
            accessibilityLabel={getReactionButtonAccessibilityLabel(userReaction)}
          />
        </ReactionContainer>
      ) : null}
    </ViewGap>
  )
}

const ShareContainer = styled.View(({ theme }) => ({
  borderRadius: theme.buttons.roundedButton.size,
}))

const ReactionContainer = styled.View(({ theme }) => ({
  borderRadius: theme.buttons.roundedButton.size,
}))
