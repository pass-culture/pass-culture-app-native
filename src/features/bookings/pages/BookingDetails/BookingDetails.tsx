import { useRoute } from '@react-navigation/native'
import React from 'react'
import { Platform } from 'react-native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { BookingDetailsContent } from 'features/bookings/components/BookingDetailsContent'
import { getBookingPropertiesV2 } from 'features/bookings/helpers'
import { BookingNotFound } from 'features/bookings/pages/BookingNotFound/BookingNotFound'
import { convertBookingResponseDateToTimezone } from 'features/bookings/queries/selectors/convertBookingsDatesToTimezone'
import { UseRouteType } from 'features/navigation/navigators/RootNavigator/types'
import { UserProfile } from 'features/share/types'
import { useLogTypeFromRemoteConfig } from 'libs/hooks/useLogTypeFromRemoteConfig'
import { ScreenError } from 'libs/monitoring/errors'
import { eventMonitoring } from 'libs/monitoring/services'
import { useSubcategoriesMapping } from 'libs/subcategories'
import { useBookingByIdQuery } from 'queries/bookings/useBookingByIdQuery'
import { LoadingPage } from 'ui/pages/LoadingPage'

export const BookingDetails = () => {
  const { params } = useRoute<UseRouteType<'BookingDetails'>>()
  const { user } = useAuthContext()

  return <BookingDetailsContainer bookingId={params.id} user={user} />
}

const BookingDetailsContainer = ({
  bookingId,
  user,
}: {
  bookingId: number
  user: UserProfile | undefined
}) => {
  const {
    data: booking,
    status,
    isLoading,
    isFetching,
    isError,
    error,
    dataUpdatedAt,
  } = useBookingByIdQuery(bookingId, { select: convertBookingResponseDateToTimezone })

  const mapping = useSubcategoriesMapping()
  const { logType } = useLogTypeFromRemoteConfig()

  if ((isLoading || !dataUpdatedAt) && !booking) {
    return <LoadingPage />
  } else if (!isLoading && !booking && !isFetching) {
    if (Platform.OS !== 'web') {
      const bookingNotFoundError = new Error('BookingNotFound')
      bookingNotFoundError.name = 'BookingNotFound'
      eventMonitoring.captureException(bookingNotFoundError, {
        extra: {
          status,
          isLoading,
          booking,
          dataUpdatedAt,
        },
      })
    }
    throw new ScreenError(`Booking #${bookingId} not found`, {
      Screen: BookingNotFound,
      logType,
    })
  } else if (isError) {
    throw error
  } else if (!booking) {
    // dead code to satisfy typescript Web compilation
    return null
  }

  const properties = getBookingPropertiesV2.getBookingProperties(
    booking,
    mapping[booking.stock?.offer?.subcategoryId]?.isEvent
  )

  return user ? (
    <BookingDetailsContent
      user={user}
      properties={properties}
      booking={booking}
      mapping={mapping}
    />
  ) : null
}
