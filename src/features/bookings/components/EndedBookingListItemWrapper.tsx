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

type EndedBookingProps = {
  booking: BookingListItemResponse
}

export const EndedBookingListItemWrapper: FunctionComponent<EndedBookingProps> = ({ booking }) => {
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
    <BookingListItemContainer
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
    </BookingListItemContainer>
  )
}

const BookingListItemContainer = styled(InternalTouchableLink)(({ theme }) => ({
  marginHorizontal: theme.designSystem.size.spacing.xl,
  marginBottom: theme.designSystem.size.spacing.l,
  ...(theme.isDesktopViewport ? { maxWidth: '50%' } : undefined),
}))
