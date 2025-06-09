import { QueryObserverResult } from '@tanstack/react-query'
import React from 'react'

import { BookingsResponse, ReactionTypeEnum, SubcategoriesResponseModelv2 } from 'api/gen'
import { bookingsSnap, emptyBookingsSnap } from 'features/bookings/fixtures'
import { availableReactionsSnap } from 'features/bookings/fixtures/availableReactionSnap'
import { useAvailableReactionQuery } from 'features/reactions/queries/useAvailableReactionQuery'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { subcategoriesDataTest } from 'libs/subcategories/fixtures/subcategoriesResponse'
import * as bookingsAPI from 'queries/bookings/useBookingsQuery'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, render, screen, userEvent, waitFor } from 'tests/utils'

import { Bookings } from './Bookings'

jest.mock('libs/network/NetInfoWrapper')

const useBookingsSpy = jest.spyOn(bookingsAPI, 'useBookingsQueryV1')

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

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const mockMutate = jest.fn()
jest.mock('features/reactions/queries/useReactionMutation', () => ({
  useReactionMutation: () => ({ mutate: mockMutate }),
}))

jest.mock('features/reactions/queries/useAvailableReactionQuery')
const mockUseAvailableReaction = useAvailableReactionQuery as jest.Mock
mockUseAvailableReaction.mockReturnValue({
  data: { numberOfReactableBookings: 0, bookings: [] },
})

const user = userEvent.setup()

jest.useFakeTimers()

describe('Bookings', () => {
  beforeEach(() => {
    mockServer.getApi<SubcategoriesResponseModelv2>('/v1/subcategories/v2', subcategoriesDataTest)
    setFeatureFlags()
  })

  it('should render correctly', async () => {
    renderBookings()

    await screen.findByText('Mes réservations')

    expect(screen).toMatchSnapshot()
  })

  it('should always execute the query (in cache or in network)', async () => {
    renderBookings()
    await act(async () => {}) // Without this act the test is flaky

    //Due to multiple renders useBookingsQuery is called three times
    expect(useBookingsSpy).toHaveBeenCalledTimes(3)
  })

  it('should display the empty bookings dedicated view', async () => {
    const useBookingsResultMock = {
      data: emptyBookingsSnap,
      isFetching: false,
    } as unknown as QueryObserverResult<BookingsResponse, unknown>
    // Due to multiple renders we need to mock useBookingsQuery six times
    useBookingsSpy
      .mockReturnValueOnce(useBookingsResultMock)
      .mockReturnValueOnce(useBookingsResultMock)
      .mockReturnValueOnce(useBookingsResultMock)
    renderBookings()

    await screen.findByText('Mes réservations')

    expect(await screen.findByText('Découvrir le catalogue')).toBeOnTheScreen()
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

    await user.press(await screen.findByText('Terminées'))

    expect(await screen.findAllByText('Avez-vous déjà vu\u00a0?')).toHaveLength(2)
  })

  it('should call updateReactions when switching from COMPLETED tab', async () => {
    renderBookings()

    await user.press(await screen.findByText('Terminées'))

    await user.press(await screen.findByText('En cours'))

    await waitFor(() => expect(mockMutate).toHaveBeenCalledTimes(1))
  })

  it('should update reactions for ended bookings without user reaction', async () => {
    renderBookings()

    await user.press(await screen.findByText('Terminées'))

    await user.press(await screen.findByText('En cours'))

    expect(mockMutate).toHaveBeenCalledWith({
      reactions: [
        { offerId: 147874, reactionType: ReactionTypeEnum.NO_REACTION },
        { offerId: 147875, reactionType: ReactionTypeEnum.NO_REACTION },
      ],
    })
  })

  it('should display a pastille when there are bookings without user reaction if wipReactionFeature FF activated', async () => {
    setFeatureFlags([RemoteStoreFeatureFlags.WIP_REACTION_FEATURE])
    mockUseAvailableReaction.mockReturnValueOnce({
      data: availableReactionsSnap,
    })

    renderBookings()

    await screen.findByText('Mes réservations')

    expect(screen.getByTestId('pastille')).toBeOnTheScreen()
  })

  it('should not display a pastille when there are bookings without user reaction if wipReactionFeature FF deactivated', async () => {
    renderBookings()

    await screen.findByText('Mes réservations')

    expect(screen.queryByTestId('pastille')).toBeNull()
  })

  it('should not display a pastille when there are not bookings without user reaction if wipReactionFeature FF activated', async () => {
    setFeatureFlags([RemoteStoreFeatureFlags.WIP_REACTION_FEATURE])
    const useBookingsResultMock = {
      data: {
        ended_bookings: [
          { ...bookingsSnap.ended_bookings[1], userReaction: ReactionTypeEnum.LIKE },
        ],
        ongoing_bookings: bookingsSnap.ongoing_bookings,
      },
      isFetching: false,
    } as unknown as QueryObserverResult<BookingsResponse, unknown>
    // Due to multiple renders we need to mock useBookingsQuery three times
    useBookingsSpy
      .mockReturnValueOnce(useBookingsResultMock)
      .mockReturnValueOnce(useBookingsResultMock)
      .mockReturnValueOnce(useBookingsResultMock)
    renderBookings()

    await screen.findByText('Mes réservations')

    expect(screen.queryByTestId('pastille')).toBeNull()
  })
})

const renderBookings = () => {
  return render(reactQueryProviderHOC(<Bookings />))
}
