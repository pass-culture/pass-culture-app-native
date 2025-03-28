import React from 'react'

import { BookingNotFound } from 'features/bookings/pages/BookingNotFound/BookingNotFound'

export const CheatcodesScreenBookingNotFound = () => (
  <BookingNotFound error={new Error('error')} resetErrorBoundary={() => null} />
)
