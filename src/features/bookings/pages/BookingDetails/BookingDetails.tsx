import { useRoute } from '@react-navigation/native'
import { UseQueryResult } from '@tanstack/react-query'
import React from 'react'
import { Platform } from 'react-native'

import { BookingResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { BookingDetailsContent } from 'features/bookings/components/BookingDetailsContent'
import { getBookingPropertiesV2 } from 'features/bookings/helpers'
import { BookingNotFound } from 'features/bookings/pages/BookingNotFound/BookingNotFound'
import { convertBookingResponseDateToTimezone } from 'features/bookings/queries/selectors/convertBookingsDatesToTimezone'
import {
  BookingDetailsResponse,
  selectBookingDetails,
} from 'features/bookings/queries/selectors/selectBookingDetails'
import { UseRouteType } from 'features/navigation/navigators/RootNavigator/types'
import { UserProfile } from 'features/share/types'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useLogTypeFromRemoteConfig } from 'libs/hooks/useLogTypeFromRemoteConfig'
import { ScreenError } from 'libs/monitoring/errors'
import { eventMonitoring } from 'libs/monitoring/services'
import { useSubcategoriesMapping } from 'libs/subcategories'
import { useBookingByIdQuery } from 'queries/bookings/useBookingByIdQuery'
import { useBookingByIdV3Query } from 'queries/bookings/useBookingByIdV3Query'
import { LoadingPage } from 'ui/pages/LoadingPage'

export const BookingDetails = () => {
  const { params } = useRoute<UseRouteType<'BookingDetails'>>()
  const { user } = useAuthContext()
  const enableSpecialEventScreenings = useFeatureFlag(
    RemoteStoreFeatureFlags.ENABLE_SPECIAL_EVENT_SCREENINGS
  )

  return enableSpecialEventScreenings ? (
    <BookingDetailsContainerV3 bookingId={params.id} user={user} />
  ) : (
    <BookingDetailsContainerV2 bookingId={params.id} user={user} />
  )
}

type BookingDetailsContainerProps = {
  bookingId: number
  user: UserProfile | undefined
}

const BookingDetailsContainerV2 = ({ bookingId, user }: BookingDetailsContainerProps) => {
  const bookingQuery = useBookingByIdQuery(bookingId, {
    select: convertBookingResponseDateToTimezone,
  })

  return (
    <BookingDetailsQueryContainer bookingId={bookingId} user={user} bookingQuery={bookingQuery} />
  )
}

const BookingDetailsContainerV3 = ({ bookingId, user }: BookingDetailsContainerProps) => {
  const bookingQuery = useBookingByIdV3Query(bookingId, { select: selectBookingDetails })

  return (
    <BookingDetailsQueryContainer bookingId={bookingId} user={user} bookingQuery={bookingQuery} />
  )
}

const BookingDetailsQueryContainer = <TBooking extends BookingResponse | BookingDetailsResponse>({
  bookingId,
  user,
  bookingQuery,
}: {
  bookingId: number
  user: UserProfile | undefined
  bookingQuery: UseQueryResult<TBooking, Error>
}) => {
  const {
    data: booking,
    status,
    isLoading,
    isFetching,
    isError,
    error,
    dataUpdatedAt,
  } = bookingQuery

  const mapping = useSubcategoriesMapping()
  const { logType } = useLogTypeFromRemoteConfig()

  if (!booking || !('stock' in booking)) {
    if (isLoading || !dataUpdatedAt) {
      return <LoadingPage />
    }

    if (!isFetching) {
      if (Platform.OS !== 'web') {
        const bookingNotFoundError = new Error('BookingNotFound')
        bookingNotFoundError.name = 'BookingNotFound'
        eventMonitoring.captureException(bookingNotFoundError, {
          extra: { status, isLoading, booking, dataUpdatedAt },
        })
      }
      throw new ScreenError(`Booking #${bookingId} not found`, {
        Screen: BookingNotFound,
        logType,
      })
    }

    return null
  }

  if (isError) {
    throw error
  }

  const properties = getBookingPropertiesV2.getBookingProperties(
    booking,
    mapping[booking.stock.offer.subcategoryId].isEvent
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
