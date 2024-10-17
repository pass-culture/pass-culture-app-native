import React, { FunctionComponent, useMemo } from 'react'
import styled from 'styled-components/native'

import { BookingReponse, OfferResponseV2, ReactionTypeEnum, UserProfileResponse } from 'api/gen'
import { useBookings } from 'features/bookings/api'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { ThumbUpFilled } from 'ui/svg/icons/ThumbUpFilled'
import { TypoDS, getSpacing } from 'ui/theme'

type Props = {
  isLoggedIn: boolean
  offer: OfferResponseV2
  user?: UserProfileResponse
  userCanReact?: boolean
  userBooking?: BookingReponse
}

export const OfferReactions: FunctionComponent<Props> = ({
  isLoggedIn,
  user,
  offer,
  userCanReact,
  userBooking,
}) => {
  const { data: bookings } = useBookings()
  const { reactionsCount } = offer
  const hasLikes = reactionsCount?.likes > 0

  const userHasLiked = useMemo(() => {
    if (!bookings?.ended_bookings) return false

    return bookings.ended_bookings.some(
      (booking) => booking.stock.offer.id === offer.id && !!booking.userReaction
    )
  }, [bookings, offer.id])

  const youngWording = reactionsCount?.likes === 1 ? 'jeune' : 'jeunes'

  if (isLoggedIn && user?.isBeneficiary) {
    if (hasLikes) {
      return (
        <StyledView gap={1}>
          <StyledThumbUp isLiked={userHasLiked} testID="thumbUp" />
          <TypoDS.BodyAccentXs>
            Aimé par {reactionsCount?.likes} {youngWording}
          </TypoDS.BodyAccentXs>
        </StyledView>
      )
    } else if (userCanReact && userBooking?.userReaction !== ReactionTypeEnum.DISLIKE) {
      return <TypoDS.BodyAccentXs>Sois le premier à réagir&nbsp;:</TypoDS.BodyAccentXs>
    } else {
      return null
    }
  }

  if (!isLoggedIn || !user?.isBeneficiary) {
    if (hasLikes) {
      return (
        <StyledView gap={1}>
          <StyledThumbUp isLiked={false} testID="thumbUp" />
          <TypoDS.BodyAccentXs>
            Aimé par {reactionsCount?.likes} {youngWording}
          </TypoDS.BodyAccentXs>
        </StyledView>
      )
    }
  }

  return null
}

const StyledThumbUp = styled(ThumbUpFilled).attrs<{ isLiked?: boolean }>(({ theme, isLiked }) => ({
  size: theme.icons.sizes.smaller,
  color: isLiked ? theme.colors.primary : theme.colors.greyDark,
}))<{ isLiked?: boolean }>``

const StyledView = styled(ViewGap)({
  flexDirection: 'row',
  alignItems: 'end',
  paddingVertical: getSpacing(1),
})
