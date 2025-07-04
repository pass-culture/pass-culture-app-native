import { UseQueryResult } from '@tanstack/react-query'
import React from 'react'

import { useRoute } from '__mocks__/@react-navigation/native'
import { BookingReponse, SubcategoriesResponseModelv2 } from 'api/gen'
import { bookingsSnap } from 'features/bookings/fixtures'
import * as ongoingOrEndedBookingAPI from 'features/bookings/queries/useOngoingOrEndedBookingQuery'
import { Booking } from 'features/bookings/types'
import { withAsyncErrorBoundary } from 'features/errors/hocs/withAsyncErrorBoundary'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import * as useNetInfoContextDefault from 'libs/network/NetInfoWrapper'
import { subcategoriesDataTest } from 'libs/subcategories/fixtures/subcategoriesResponse'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, checkAccessibilityFor, render } from 'tests/utils/web'

import { BookingDetails as BookingDetailsDefault } from './BookingDetails'

const BookingDetails = withAsyncErrorBoundary(BookingDetailsDefault)

jest.mock('queries/profile/useResetRecreditAmountToShowMutation')
jest.mock('libs/itinerary/useItinerary')
jest.mock('features/navigation/navigationRef')
jest.mock('features/navigation/helpers/openUrl')
jest.mock('libs/network/NetInfoWrapper')
const mockUseNetInfoContext = jest.spyOn(useNetInfoContextDefault, 'useNetInfoContext') as jest.Mock

jest.mock('libs/firebase/analytics/analytics')

describe('BookingDetails', () => {
  mockUseNetInfoContext.mockReturnValue({ isConnected: true })
  useRoute.mockImplementation(() => ({ params: { id: 456 } }))

  beforeEach(() => {
    setFeatureFlags([RemoteStoreFeatureFlags.ENABLE_PACIFIC_FRANC_CURRENCY])
    mockServer.getApi<SubcategoriesResponseModelv2>('/v1/subcategories/v2', subcategoriesDataTest)
  })

  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = renderBookingDetails(bookingsSnap.ongoing_bookings[0])

      await act(async () => {
        const results = await checkAccessibilityFor(container)

        expect(results).toHaveNoViolations()
      })
    })
  })
})

const renderBookingDetails = (booking: Booking) => {
  jest.spyOn(ongoingOrEndedBookingAPI, 'useOngoingOrEndedBookingQueryV1').mockReturnValue({
    data: booking,
    isLoading: false,
    isSuccess: true,
    isError: false,
    error: undefined,
  } as unknown as UseQueryResult<BookingReponse | null>)
  return render(reactQueryProviderHOC(<BookingDetails />))
}
