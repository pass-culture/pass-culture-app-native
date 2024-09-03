import React from 'react'
import { QueryObserverResult } from 'react-query'

import { navigate } from '__mocks__/@react-navigation/native'
import { BookingsResponse, SubcategoriesResponseModelv2 } from 'api/gen'
import * as bookingsAPI from 'features/bookings/api/useBookings'
import { bookingsSnap, emptyBookingsSnap } from 'features/bookings/fixtures/bookingsSnap'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { subcategoriesDataTest } from 'libs/subcategories/fixtures/subcategoriesResponse'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render, screen } from 'tests/utils'

import { Bookings } from './Bookings'

jest.mock('libs/network/NetInfoWrapper')

const useBookingsSpy = jest.spyOn(bookingsAPI, 'useBookings')

useBookingsSpy.mockReturnValue({
  data: bookingsSnap,
  isFetching: false,
} as unknown as QueryObserverResult<BookingsResponse, unknown>)

jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({
    resetSearch: jest.fn(),
  }),
}))

jest.mock('libs/firebase/analytics/analytics')

const useFeatureFlagSpy = jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(false)

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

jest.mock('@batch.com/react-native-plugin', () =>
  jest.requireActual('__mocks__/libs/react-native-batch')
)

describe('Bookings', () => {
  beforeEach(() => {
    mockServer.getApi<SubcategoriesResponseModelv2>('/v1/subcategories/v2', subcategoriesDataTest)
  })

  it('should render correctly', async () => {
    renderBookings()

    await screen.findByText('Mes réservations')

    expect(screen).toMatchSnapshot()
  })

  it('should always execute the query (in cache or in network)', async () => {
    renderBookings()
    await act(async () => {})

    //Due to multiple renders useBookings is called twice
    expect(useBookingsSpy).toHaveBeenCalledTimes(2)
  })

  it('should display the right number of ongoing bookings', async () => {
    renderBookings()
    await act(async () => {})

    expect(screen.getByText('2 réservations en cours')).toBeOnTheScreen()
  })

  it('should display the empty bookings dedicated view', async () => {
    const useBookingsResultMock = {
      data: emptyBookingsSnap,
      isFetching: false,
    } as unknown as QueryObserverResult<BookingsResponse, unknown>
    // Due to multiple renders we need to mock useBookings twice
    useBookingsSpy
      .mockReturnValueOnce(useBookingsResultMock)
      .mockReturnValueOnce(useBookingsResultMock)
    renderBookings()

    await act(async () => {})

    expect(await screen.findByText('Découvrir le catalogue')).toBeOnTheScreen()
  })

  it('should display ended bookings CTA with the right number', async () => {
    renderBookings()
    await act(async () => {})

    expect(screen.getByText('2')).toBeOnTheScreen()
    expect(screen.getByText('Réservations terminées')).toBeOnTheScreen()
  })

  it('should navigate to ended bookings page on press ended bookings CTA', async () => {
    renderBookings()

    const cta = await screen.findByText('Réservations terminées')
    fireEvent.press(cta)

    expect(navigate).toHaveBeenCalledWith('EndedBookings', undefined)
  })

  describe('when feature flag is activated', () => {
    beforeEach(() => {
      useFeatureFlagSpy.mockReturnValueOnce(true)
    })

    it('should display the 2 tabs "Terminées" and "En cours"', async () => {
      renderBookings()

      expect(await screen.findByText('En cours')).toBeOnTheScreen()
      expect(await screen.findByText('Terminées')).toBeOnTheScreen()
    })

    it('should display list of bookings by default', async () => {
      renderBookings()

      expect(await screen.findAllByText('Avez-vous déjà vu\u00a0?')).toHaveLength(2)
    })

    it('should change on "Terminées" tab and have one ended booking', async () => {
      renderBookings()

      fireEvent.press(await screen.findByText('Terminées'))

      expect(await screen.findAllByText('Avez-vous déjà vu\u00a0?')).toHaveLength(2)
    })
  })
})

const renderBookings = () => {
  return render(reactQueryProviderHOC(<Bookings />))
}
