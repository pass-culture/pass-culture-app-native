import { useRoute } from '@react-navigation/native'
import React from 'react'
import { Platform } from 'react-native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { BookingDetailsContent } from 'features/bookings/components/BookingDetailsContent'
import { BookingDetailsContent as OldBookingDetailsContent } from 'features/bookings/components/OldBookingDetails/BookingDetailsContent'
import { getBookingProperties } from 'features/bookings/helpers'
import { BookingNotFound } from 'features/bookings/pages/BookingNotFound/BookingNotFound'
import { useOngoingOrEndedBookingQuery } from 'features/bookings/queries'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useLogTypeFromRemoteConfig } from 'libs/hooks/useLogTypeFromRemoteConfig'
import { ScreenError } from 'libs/monitoring/errors'
import { eventMonitoring } from 'libs/monitoring/services'
import { useSubcategoriesMapping } from 'libs/subcategories'
import { LoadingPage } from 'ui/pages/LoadingPage'

export const BookingDetails = () => {
  const enableNewBookingPage = useFeatureFlag(RemoteStoreFeatureFlags.WIP_NEW_BOOKING_PAGE)
  const { user } = useAuthContext()
  const { params } = useRoute<UseRouteType<'BookingDetails'>>()
  const {
    data: booking,
    status,
    isLoading,
    isError,
    error,
    dataUpdatedAt,
  } = useOngoingOrEndedBookingQuery(params.id)
  const mapping = useSubcategoriesMapping()
  const { logType } = useLogTypeFromRemoteConfig()

  if ((isLoading || !dataUpdatedAt) && !booking) {
    return <LoadingPage />
  } else if (!isLoading && !booking) {
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
    throw new ScreenError(`Booking #${params.id} not found`, {
      Screen: BookingNotFound,
      logType,
    })
  } else if (isError) {
    throw error
  } else if (!booking) {
    // dead code to satisfy typescript Web compilation
    return null
  }

  const properties = getBookingProperties(
    booking,
    mapping[booking.stock.offer.subcategoryId].isEvent
  )
  return enableNewBookingPage && properties.isEvent && user ? (
    <BookingDetailsContent
      user={user}
      properties={properties}
      booking={booking}
      mapping={mapping}
    />
  ) : (
    <OldBookingDetailsContent
      properties={properties}
      booking={booking}
      paramsId={params.id}
      mapping={mapping}
    />
  )
}
