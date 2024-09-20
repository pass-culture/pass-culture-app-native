import React from 'react'
import { QueryObserverResult } from 'react-query'

import { BookingsResponse } from 'api/gen'
import * as bookingsAPI from 'features/bookings/api/useBookings'
import { bookingsSnap } from 'features/bookings/fixtures/bookingsSnap'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { checkAccessibilityFor, render } from 'tests/utils/web'

import { EndedBookings } from './EndedBookings'

jest.mock('libs/subcategories/useCategoryId')

jest.mock('libs/firebase/analytics/analytics')
jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(false)
jest.mock('features/navigation/RootNavigator/routes')

jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn(),
}))

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

describe('EndedBookings', () => {
  describe('Accessibility', () => {
    // eslint-disable-next-line jest/no-disabled-tests
    it.skip('should not have basic accessibility issues', async () => {
      const { container } = renderEndedBookings(bookingsSnap)

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})

const renderEndedBookings = (bookings: BookingsResponse) => {
  jest
    .spyOn(bookingsAPI, 'useBookings')
    .mockReturnValue({ data: bookings } as QueryObserverResult<BookingsResponse, unknown>)

  return render(
    reactQueryProviderHOC(<EndedBookings enableBookingImprove={false} bookings={bookingsSnap} />)
  )
}
