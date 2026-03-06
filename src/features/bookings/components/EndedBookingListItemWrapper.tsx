import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { BookingListItemResponse } from 'api/gen'
import { BookingListItem } from 'features/bookings/components/BookingListItem'
import { BookingListItemLabel } from 'features/bookings/components/BookingListItemLabel'
import { ENDED_BOOKING_REASONS } from 'features/bookings/constants'
import { getEndedBookingReason } from 'features/bookings/helpers/getEndedBookingReason'
import { getBookingListItemIcon } from 'features/bookings/helpers/v2/getBookingListItemIcon'
import { getEndedBookingItemProperties } from 'features/bookings/helpers/v2/getEndedBookingItemProperties'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { useSubcategory } from 'libs/subcategories'
import { usePrePopulateOffer } from 'shared/offer/usePrePopulateOffer'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { Button } from 'ui/designSystem/Button/Button'
import { ThumbUp } from 'ui/svg/icons/ThumbUp'

type EndedBookingProps = {
  booking: BookingListItemResponse
  handleShowReactionModal: (booking: BookingListItemResponse) => void
}

export const EndedBookingListItemWrapper: FunctionComponent<EndedBookingProps> = ({
  booking,
  handleShowReactionModal,
}) => {
  const {
    imageUrl,
    isDigital,
    name,
    subcategoryId,
    venue: { name: venueName },
    withdrawalType,
  } = booking.stock.offer

  const prePopulateOffer = usePrePopulateOffer()
  const netInfo = useNetInfoContext()
  const { isEvent, categoryId } = useSubcategory(subcategoryId)

  const { accessibilityLabel, isBookingEligibleForArchive, handlePressOffer, navigateTo } =
    getEndedBookingItemProperties({
      booking,
      categoryId,
      netInfo,
      prePopulateOffer,
    })

  const { title } =
    ENDED_BOOKING_REASONS[
      getEndedBookingReason(
        !!booking.dateUsed,
        booking.cancellationReason,
        isBookingEligibleForArchive
      )
    ]

  const icon = getBookingListItemIcon({
    isDigital,
    withdrawalType,
  })

  return (
    <Wrapper>
      <InternalTouchableLink
        navigateTo={navigateTo}
        onBeforeNavigate={handlePressOffer}
        accessibilityLabel={accessibilityLabel}>
        <BookingListItem
          display={isEvent ? 'punched' : 'full'}
          title={name}
          subtitle={venueName}
          imageUrl={imageUrl ?? ''}>
          <BookingListItemLabel alert={!!booking.expirationDate} text={title} icon={icon} />
        </BookingListItem>
      </InternalTouchableLink>
      {booking.canReact && booking.userReaction === null ? (
        <LikeButtonContainer>
          <Button
            icon={ThumbUp}
            onPress={() => handleShowReactionModal(booking)}
            accessibilityLabel={`Ouvrir la modale de réaction pour la réservation ${name}`}
            variant="secondary"
            color="neutral"
            size="small"
            iconButton
          />
        </LikeButtonContainer>
      ) : null}
    </Wrapper>
  )
}

const Wrapper = styled.View(({ theme }) => ({
  marginHorizontal: theme.designSystem.size.spacing.xl,
  marginBottom: theme.designSystem.size.spacing.l,
  ...(theme.isDesktopViewport ? { maxWidth: '50%' } : undefined),
}))

const LikeButtonContainer = styled.View(({ theme }) => ({
  position: 'absolute',
  top: theme.designSystem.size.spacing.m,
  right: theme.designSystem.size.spacing.m,
}))
