import { convertBookingsResponseV2 } from 'features/bookings/helpers/v2/convertBookingsResponseV2'
import { convertBookingsListResponseV2DatesToTimezone } from 'features/bookings/queries/selectors/convertBookingsDatesToTimezone'
import { BookingStatus } from 'features/bookings/types'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import {
  useBookingsByStatusQuery,
  useBookingsV2WithConvertedTimezoneQuery,
} from 'queries/bookings/useBookingsQuery'

export const useActiveBookingsQuery = (bookingStatus: BookingStatus) => {
  const enableNewBookings = useFeatureFlag(RemoteStoreFeatureFlags.WIP_NEW_BOOKINGS_ENDED_ONGOING)

  const useBookingByStatus = () =>
    useBookingsByStatusQuery(bookingStatus, {
      select: convertBookingsListResponseV2DatesToTimezone,
    })

  const useBookingsV2 = () =>
    useBookingsV2WithConvertedTimezoneQuery(
      convertBookingsResponseV2,
      `${bookingStatus}Bookings`,
      true
    )

  return enableNewBookings ? useBookingByStatus : useBookingsV2
}
