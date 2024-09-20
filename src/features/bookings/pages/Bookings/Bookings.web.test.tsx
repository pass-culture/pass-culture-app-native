import React from 'react'
import { QueryObserverResult, UseQueryResult } from 'react-query'

import { navigate } from '__mocks__/@react-navigation/native'
import { BookingsResponse, SubcategoriesResponseModelv2 } from 'api/gen'
import * as bookingsAPI from 'features/bookings/api/useBookings'
import { bookingsSnap, emptyBookingsSnap } from 'features/bookings/fixtures/bookingsSnap'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { useSubcategories } from 'libs/subcategories/useSubcategories'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, checkAccessibilityFor, fireEvent, render, screen, waitFor } from 'tests/utils/web'

import { Bookings } from './Bookings'

jest.mock('libs/subcategories/useSubcategories')
const mockUseSubcategories = jest.mocked(useSubcategories)
mockUseSubcategories.mockReturnValue({
  isLoading: false,
} as UseQueryResult<SubcategoriesResponseModelv2, unknown>)

jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({
    resetSearch: jest.fn(),
  }),
}))

jest.mock('libs/firebase/analytics/analytics')
jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(false)

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

describe('Bookings', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = renderBookings(bookingsSnap)

      await act(async () => {
        const results = await checkAccessibilityFor(container)

        expect(results).toHaveNoViolations()
      })
    })
  })

  it('should always execute the query (in cache or in network)', async () => {
    const useBookings = jest.spyOn(bookingsAPI, 'useBookings')
    renderBookings(bookingsSnap)

    await waitFor(() => {
      expect(useBookings).toHaveBeenCalledTimes(2)
    })
  })

  it('should display the right number of ongoing bookings', async () => {
    renderBookings(bookingsSnap)

    expect(await screen.findByText('2 réservations en cours')).toBeInTheDocument()
  })

  it('should display the empty bookings dedicated view', async () => {
    renderBookings(emptyBookingsSnap)

    expect(await screen.findByText('Découvrir le catalogue')).toBeInTheDocument()
  })

  it('should display ended bookings CTA with the right number', async () => {
    renderBookings(bookingsSnap)

    await waitFor(() => {
      expect(screen.getByText('2')).toBeInTheDocument()
      expect(screen.getByText('Réservations terminées')).toBeInTheDocument()
    })
  })

  it('should navigate to ended bookings page on press ended bookings CTA', async () => {
    renderBookings(bookingsSnap)

    const cta = screen.getByText('Réservations terminées')
    fireEvent.click(cta)

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('EndedBookings', undefined)
    })
  })
})

const renderBookings = (bookings: BookingsResponse) => {
  jest
    .spyOn(bookingsAPI, 'useBookings')
    .mockReturnValue({ data: bookings, isFetching: false } as QueryObserverResult<
      BookingsResponse,
      unknown
    >)

  return render(reactQueryProviderHOC(<Bookings />))
}
