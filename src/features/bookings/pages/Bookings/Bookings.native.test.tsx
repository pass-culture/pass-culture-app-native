import React from 'react'

import {
  BookingsResponseV2,
  GetAvailableReactionsResponse,
  ReactionTypeEnum,
  SubcategoriesResponseModelv2,
} from 'api/gen'
import { bookingsSnapV2, emptyBookingsSnap } from 'features/bookings/fixtures'
import { availableReactionsSnap } from 'features/bookings/fixtures/availableReactionSnap'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import * as useNetInfoContextDefault from 'libs/network/NetInfoWrapper'
import { BatchEvent, BatchProfile } from 'libs/react-native-batch'
import { subcategoriesDataTest } from 'libs/subcategories/fixtures/subcategoriesResponse'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent } from 'tests/utils'

import { Bookings } from './Bookings'
import { storage } from 'libs/storage'

jest.mock('libs/jwt/jwt')
jest.mock('features/auth/context/AuthContext', () => ({
  useAuthContext: jest.fn(() => ({ isLoggedIn: true })),
}))

const mockUseNetInfoContext = jest.spyOn(useNetInfoContextDefault, 'useNetInfoContext') as jest.Mock

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

const user = userEvent.setup()

describe('Bookings', () => {
  beforeAll(() =>
    jest.useFakeTimers({
      legacyFakeTimers: true,
    })
  )

  beforeEach(() => {
    storage.clear('has_seen_booking_page')
    mockServer.getApi<BookingsResponseV2>('/v2/bookings', bookingsSnapV2)
    mockUseNetInfoContext.mockReturnValue({ isConnected: true, isInternetReachable: true })
    mockServer.getApi<SubcategoriesResponseModelv2>('/v1/subcategories/v2', subcategoriesDataTest)
    setFeatureFlags()
    mockServer.getApi<GetAvailableReactionsResponse>(
      '/v1/reaction/available',
      availableReactionsSnap
    )
  })

  afterAll(() => jest.useRealTimers())

  it('should render correctly', async () => {
    renderBookings()

    await screen.findByText('Mes réservations')

    expect(screen).toMatchSnapshot()
  })

  it('should send Batch event once on the first page render', async () => {
    renderBookings()

    await screen.findByText('Mes réservations')

    expect(BatchProfile.trackEvent).toHaveBeenNthCalledWith(1, BatchEvent.hasSeenBookingPage)

    jest.clearAllMocks()

    renderBookings()

    await screen.findByText('Mes réservations')

    expect(BatchProfile.trackEvent).toHaveBeenCalledTimes(0)
  })

  it('should display the empty bookings dedicated view', async () => {
    mockServer.getApi('/v2/bookings', emptyBookingsSnap)

    renderBookings()

    await screen.findByText('Mes réservations')

    expect(
      await screen.findByText(
        'Tu n’as pas de réservation en cours. Explore le catalogue pour trouver ton bonheur !'
      )
    ).toBeOnTheScreen()
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

  //TODO(PC-37969): fix this test
  it.skip('should call updateReactions when switching from COMPLETED tab', async () => {
    renderBookings()

    await user.press(await screen.findByText('Terminées'))

    await user.press(await screen.findByText('En cours'))

    expect(mockMutate).toHaveBeenCalledTimes(1)
  })

  //TODO(PC-37969): fix this test
  it.skip('should update reactions for ended bookings without user reaction', async () => {
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

    renderBookings()

    await screen.findByText('Mes réservations')

    expect(await screen.findByTestId('pastille')).toBeOnTheScreen()
  })

  it('should not display a pastille when there are bookings without user reaction if wipReactionFeature FF deactivated', async () => {
    renderBookings()

    await screen.findByText('Mes réservations')

    expect(screen.queryByTestId('pastille')).toBeNull()
  })

  it('should not display a pastille when there are not bookings without user reaction if wipReactionFeature FF activated', async () => {
    setFeatureFlags([RemoteStoreFeatureFlags.WIP_REACTION_FEATURE])

    mockServer.getApi<BookingsResponseV2>('/v2/bookings', {
      ...bookingsSnapV2,
      endedBookings: [{ ...bookingsSnapV2.endedBookings[1], userReaction: ReactionTypeEnum.LIKE }],
    })

    renderBookings()

    await screen.findByText('Mes réservations')

    expect(screen.queryByTestId('pastille')).toBeNull()
  })
})

const renderBookings = () => {
  return render(reactQueryProviderHOC(<Bookings />))
}
