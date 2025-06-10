import React from 'react'

import { BookingListItem } from 'features/bookings/components/BookingListItem'
import { BookingListItemLabel } from 'features/bookings/components/BookingListItemLabel'
import { render, screen } from 'tests/utils'

const label = <BookingListItemLabel text="Avant dernier jour pour retirer" alert icon="clock" />

describe('<BookingLisItem />', () => {
  it('should render full ticket', async () => {
    render(
      <BookingListItem
        imageUrl="url"
        title="Parasites"
        subtitle="Librairie La Brèche"
        display="full">
        {label}
      </BookingListItem>
    )

    expect(screen.getByTestId('full_booking_list_item')).toBeOnTheScreen()
  })
})
