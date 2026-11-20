import { useRoute } from '@react-navigation/native'
import React from 'react'

import { CinemaScreeningDetailsModal as CinemaScreeningDetailsModalContent } from 'features/bookings/components/CinemaScreeningDetailsModal/CinemaScreeningDetailsModal'
import { selectBookingDetails } from 'features/bookings/queries/selectors/selectBookingDetails'
import { UseRouteType } from 'features/navigation/navigators/RootNavigator/types'
import { useGoBack } from 'features/navigation/useGoBack'
import { useBookingByIdV3Query } from 'queries/bookings/useBookingByIdV3Query'

export const CinemaScreeningDetailsModal = () => {
  const { params } = useRoute<UseRouteType<'CinemaScreeningDetailsModal'>>()
  const bookingId = params.id
  const { goBack } = useGoBack('BookingDetails', { id: bookingId })
  const { data: booking, isFetched } = useBookingByIdV3Query(bookingId, {
    select: selectBookingDetails,
  })
  const details = booking?.cinemaScreeningDetails ?? []

  if (!isFetched && details.length === 0) return null

  return <CinemaScreeningDetailsModalContent details={details} onClose={goBack} />
}
