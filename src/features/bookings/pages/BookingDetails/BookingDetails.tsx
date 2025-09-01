import { useRoute } from '@react-navigation/native'
import React from 'react'
import { Platform } from 'react-native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { BookingDetailsContent } from 'features/bookings/components/BookingDetailsContent'
import { BookingDetailsContent as OldBookingDetailsContent } from 'features/bookings/components/OldBookingDetails/BookingDetailsContent'
import { getBookingProperties, getBookingPropertiesV2 } from 'features/bookings/helpers'
import { BookingNotFound } from 'features/bookings/pages/BookingNotFound/BookingNotFound'
import {
  useOngoingOrEndedBookingQuery,
  useOngoingOrEndedBookingQueryV2,
} from 'features/bookings/queries'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { UserProfileResponseWithoutSurvey } from 'features/share/types'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useLogTypeFromRemoteConfig } from 'libs/hooks/useLogTypeFromRemoteConfig'
import { ScreenError } from 'libs/monitoring/errors'
import { eventMonitoring } from 'libs/monitoring/services'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { useSubcategoriesMapping } from 'libs/subcategories'
import { LoadingPage } from 'ui/pages/LoadingPage'

export const BookingDetails = () => {
  const { params } = useRoute<UseRouteType<'BookingDetails'>>()
  const enableNewBookingPage = useFeatureFlag(RemoteStoreFeatureFlags.WIP_NEW_BOOKING_PAGE)
  const { user, isLoggedIn } = useAuthContext()
  const netInfo = useNetInfoContext()

  return enableNewBookingPage ? (
    <BookingDetailsContainer
      bookingId={params.id}
      enabledQuery={!!netInfo.isConnected && !!netInfo.isInternetReachable && isLoggedIn}
      user={user}
    />
  ) : (
    <BookingDetailsContainerOld bookingId={params.id} />
  )
}

const BookingDetailsContainerOld = ({ bookingId }: { bookingId: number }) => {
  const {
    data: booking,
    status,
    isLoading,
    isFetching,
    isError,
    error,
    dataUpdatedAt,
  } = useOngoingOrEndedBookingQuery(bookingId)

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

  const properties = getBookingProperties(
    booking,
    mapping[booking.stock.offer.subcategoryId].isEvent
  )
  return (
    <OldBookingDetailsContent
      properties={properties}
      booking={booking}
      paramsId={bookingId}
      mapping={mapping}
    />
  )
}

const BookingDetailsContainer = ({
  bookingId,
  enabledQuery,
  user,
}: {
  bookingId: number
  enabledQuery: boolean
  user: UserProfileResponseWithoutSurvey | undefined
}) => {
  const {
    data: booking,
    status,
    isLoading,
    isFetching,
    isError,
    error,
    dataUpdatedAt,
  } = useOngoingOrEndedBookingQueryV2(bookingId, enabledQuery)

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
    mapping[booking.stock.offer.subcategoryId].isEvent
  )

  // FIXME(PC-36440): To remove when no need for Old/new container

  return (properties.isPhysical || properties.isEvent || properties.isDigital) && user ? (
    <BookingDetailsContent
      user={user}
      properties={properties}
      booking={booking}
      mapping={mapping}
    />
  ) : (
    <BookingDetailsContainerOld bookingId={bookingId} />
  )
}
