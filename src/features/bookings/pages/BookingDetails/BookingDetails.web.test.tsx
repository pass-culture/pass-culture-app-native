import React from 'react'
import { UseQueryResult } from 'react-query'

import { useRoute } from '__mocks__/@react-navigation/native'
import { BookingReponse, SubcategoriesResponseModelv2 } from 'api/gen'
import * as ongoingOrEndedBookingAPI from 'features/bookings/api/useOngoingOrEndedBooking'
import { bookingsSnap } from 'features/bookings/fixtures/bookingsSnap'
import { Booking } from 'features/bookings/types'
import { withAsyncErrorBoundary } from 'features/errors/hocs/withAsyncErrorBoundary'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { useNetInfoContext as useNetInfoContextDefault } from 'libs/network/NetInfoWrapper'
import { placeholderData } from 'libs/subcategories/placeholderData'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, checkAccessibilityFor, render } from 'tests/utils/web'

import { BookingDetails as BookingDetailsDefault } from './BookingDetails'

const BookingDetails = withAsyncErrorBoundary(BookingDetailsDefault)

jest.mock('features/profile/api/useResetRecreditAmountToShow')
jest.mock('libs/itinerary/useItinerary')
jest.mock('features/navigation/navigationRef')
jest.mock('features/navigation/helpers/openUrl')
jest.mock('libs/network/useNetInfo', () => jest.requireMock('@react-native-community/netinfo'))

jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(false)

const mockUseNetInfoContext = useNetInfoContextDefault as jest.Mock

describe('BookingDetails', () => {
  mockUseNetInfoContext.mockReturnValue({ isConnected: true })
  useRoute.mockImplementation(() => ({ params: { id: 456 } }))

  beforeEach(() => {
    mockServer.getApi<SubcategoriesResponseModelv2>('/v1/subcategories/v2', placeholderData)
  })

  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      // @ts-expect-error: because of noUncheckedIndexedAccess
      const { container } = renderBookingDetails(bookingsSnap.ongoing_bookings[0])

      await act(async () => {
        const results = await checkAccessibilityFor(container)

        expect(results).toHaveNoViolations()
      })
    })
  })
})

function renderBookingDetails(booking: Booking) {
  jest.spyOn(ongoingOrEndedBookingAPI, 'useOngoingOrEndedBooking').mockReturnValue({
    data: booking,
    isLoading: false,
    isSuccess: true,
    isError: false,
    error: undefined,
  } as unknown as UseQueryResult<BookingReponse | null>)
  return render(reactQueryProviderHOC(<BookingDetails />))
}
