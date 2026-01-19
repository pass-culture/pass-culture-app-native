import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { BookingListItemResponse } from 'api/gen'
import { BookingListItem } from 'features/bookings/components/BookingListItem'
import { BookingListItemLabel } from 'features/bookings/components/BookingListItemLabel'
import { getBookingListItemIcon } from 'features/bookings/helpers/v2/getBookingListItemIcon'
import { getBookingListItemLabel } from 'features/bookings/helpers/v2/getBookingListItemLabel'
import { getOngoingBookingItemProperties } from 'features/bookings/helpers/v2/getOngoingBookingItemProperties'
import { useSubcategory } from 'libs/subcategories'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'

type OngoingBookingProps = {
  booking: BookingListItemResponse
  eligibleBookingsForArchive: BookingListItemResponse[]
}

export const OngoingBookingListItemWrapper: FunctionComponent<OngoingBookingProps> = ({
  booking,
  eligibleBookingsForArchive,
}) => {
  const {
    imageUrl,
    isDigital,
    name,
    subcategoryId,
    venue: { name: venueName },
    withdrawalType,
  } = booking.stock.offer

  const { isEvent } = useSubcategory(subcategoryId)

  const {
    accessibilityLabel,
    canDisplayExpirationMessage,
    correctExpirationMessages,
    dateLabel,
    onBeforeNavigate,
    navigateTo,
    withdrawLabel,
  } = getOngoingBookingItemProperties({ booking, isEvent, eligibleBookingsForArchive })

  const label = getBookingListItemLabel({
    canDisplayExpirationMessage,
    correctExpirationMessages,
    dateLabel,
    withdrawLabel,
  })

  const icon = getBookingListItemIcon({
    isDigital,
    withdrawalType,
  })

  return (
    <BookingListItemContainer
      navigateTo={navigateTo}
      onBeforeNavigate={onBeforeNavigate}
      accessibilityLabel={accessibilityLabel}>
      <BookingListItem
        display={isEvent ? 'punched' : 'full'}
        title={name}
        subtitle={venueName}
        imageUrl={imageUrl ?? ''}>
        <BookingListItemLabel alert={!!booking.expirationDate} text={label} icon={icon} />
      </BookingListItem>
    </BookingListItemContainer>
  )
}

const BookingListItemContainer = styled(InternalTouchableLink)(({ theme }) => ({
  marginHorizontal: theme.designSystem.size.spacing.xl,
  marginBottom: theme.designSystem.size.spacing.l,
  ...(theme.isDesktopViewport ? { maxWidth: '50%' } : undefined),
}))
