import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { BookingReponse, NativeCategoryIdEnumv2, ReactionTypeEnum } from 'api/gen'
import { SmallBadgedButton } from 'features/bookings/components/SmallBadgedButton'
import { useReactionIcon } from 'features/bookings/helpers/useReactionIcon/useReactionIcon'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useRemoteConfigContext } from 'libs/firebase/remoteConfig/RemoteConfigProvider'
import { RoundedButton } from 'ui/components/buttons/RoundedButton'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'

type Props = {
  booking: BookingReponse
  nativeCategoryId: NativeCategoryIdEnumv2
  handlePressShareOffer: VoidFunction
  handleShowReactionModal: VoidFunction
  userReaction?: ReactionTypeEnum | null
}

export const EndedBookingInteractionButtons: FunctionComponent<Props> = ({
  booking,
  nativeCategoryId,
  handlePressShareOffer,
  handleShowReactionModal,
  userReaction,
}) => {
  const { reactionCategories } = useRemoteConfigContext()
  const shouldDisplayReactionFeature = useFeatureFlag(RemoteStoreFeatureFlags.WIP_REACTION_FEATURE)
  const { cancellationDate, stock } = booking

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

  const canReact =
    shouldDisplayReactionFeature &&
    reactionCategories.categories.includes(nativeCategoryId) &&
    !cancellationDate

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
      {canReact ? (
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
