import React from 'react'
import { QueryObserverResult } from 'react-query'

import { navigate } from '__mocks__/@react-navigation/native'
import {
  BookingsResponse,
  NativeCategoryIdEnumv2,
  ReactionTypeEnum,
  SubcategoriesResponseModelv2,
} from 'api/gen'
import * as bookingsAPI from 'features/bookings/api/useBookings'
import { bookingsSnap, emptyBookingsSnap } from 'features/bookings/fixtures/bookingsSnap'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { DEFAULT_REMOTE_CONFIG } from 'libs/firebase/remoteConfig/remoteConfig.constants'
import * as useRemoteConfigContext from 'libs/firebase/remoteConfig/RemoteConfigProvider'
import { subcategoriesDataTest } from 'libs/subcategories/fixtures/subcategoriesResponse'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render, screen } from 'tests/utils'

import { Bookings } from './Bookings'

jest.mock('libs/network/NetInfoWrapper')

const useBookingsSpy = jest.spyOn(bookingsAPI, 'useBookings')
const useRemoteConfigContextSpy = jest.spyOn(useRemoteConfigContext, 'useRemoteConfigContext')

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

const useFeatureFlagSpy = jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag')

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

jest.mock('@batch.com/react-native-plugin', () =>
  jest.requireActual('__mocks__/libs/react-native-batch')
)

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const mockMutate = jest.fn()
jest.mock('features/reactions/api/useReactionMutation', () => ({
  useReactionMutation: () => ({ mutate: mockMutate }),
}))

describe('Bookings', () => {
  beforeAll(() => {
    useRemoteConfigContextSpy.mockReturnValue({
      ...DEFAULT_REMOTE_CONFIG,
      reactionCategories: {
        categories: [NativeCategoryIdEnumv2.SEANCES_DE_CINEMA],
      },
    })
  })

  beforeEach(() => {
    mockServer.getApi<SubcategoriesResponseModelv2>('/v1/subcategories/v2', subcategoriesDataTest)
    activateFeatureFlags()
  })

  it('should render correctly', async () => {
    renderBookings()

    await screen.findByText('Mes réservations')

    expect(screen).toMatchSnapshot()
  })

  it('should always execute the query (in cache or in network)', async () => {
    renderBookings()
    await act(async () => {})

    //Due to multiple renders useBookings is called nine times
    expect(useBookingsSpy).toHaveBeenCalledTimes(9)
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
    // Due to multiple renders we need to mock useBookings six times
    useBookingsSpy
      .mockReturnValueOnce(useBookingsResultMock)
      .mockReturnValueOnce(useBookingsResultMock)
      .mockReturnValueOnce(useBookingsResultMock)
      .mockReturnValueOnce(useBookingsResultMock)
      .mockReturnValueOnce(useBookingsResultMock)
      .mockReturnValueOnce(useBookingsResultMock)
      .mockReturnValueOnce(useBookingsResultMock)
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
      activateFeatureFlags([RemoteStoreFeatureFlags.WIP_BOOKING_IMPROVE])
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

    it('should call updateReactions when switching from COMPLETED tab', async () => {
      renderBookings()

      fireEvent.press(await screen.findByText('Terminées'))

      fireEvent.press(await screen.findByText('En cours'))

      expect(mockMutate).toHaveBeenCalledTimes(1)
    })

    it('should update reactions for ended bookings without user reaction', async () => {
      renderBookings()

      fireEvent.press(await screen.findByText('Terminées'))

      fireEvent.press(await screen.findByText('En cours'))

      expect(mockMutate).toHaveBeenCalledWith({
        reactions: [
          { offerId: 147874, reactionType: ReactionTypeEnum.NO_REACTION },
          { offerId: 147874, reactionType: ReactionTypeEnum.NO_REACTION },
        ],
      })
    })

    it('should display a pastille when there are bookings without user reaction if wipReactionFeature FF activated', async () => {
      activateFeatureFlags([
        RemoteStoreFeatureFlags.WIP_BOOKING_IMPROVE,
        RemoteStoreFeatureFlags.WIP_REACTION_FEATURE,
      ])
      renderBookings()

      await act(async () => {})

      expect(screen.getByTestId('pastille')).toBeOnTheScreen()
    })

    it('should not display a pastille when there are bookings without user reaction if wipReactionFeature FF deactivated', async () => {
      renderBookings()

      await act(async () => {})

      expect(screen.queryByTestId('pastille')).toBeNull()
    })

    it('should not display a pastille when there are not bookings without user reaction if wipReactionFeature FF activated', async () => {
      activateFeatureFlags([
        RemoteStoreFeatureFlags.WIP_BOOKING_IMPROVE,
        RemoteStoreFeatureFlags.WIP_REACTION_FEATURE,
      ])
      const useBookingsResultMock = {
        data: {
          ended_bookings: [
            { ...bookingsSnap.ended_bookings[1], userReaction: ReactionTypeEnum.LIKE },
          ],
          ongoing_bookings: bookingsSnap.ongoing_bookings,
        },
        isFetching: false,
      } as unknown as QueryObserverResult<BookingsResponse, unknown>
      // Due to multiple renders we need to mock useBookings six times
      useBookingsSpy
        .mockReturnValueOnce(useBookingsResultMock)
        .mockReturnValueOnce(useBookingsResultMock)
        .mockReturnValueOnce(useBookingsResultMock)
        .mockReturnValueOnce(useBookingsResultMock)
        .mockReturnValueOnce(useBookingsResultMock)
        .mockReturnValueOnce(useBookingsResultMock)
      renderBookings()

      await act(async () => {})

      expect(screen.queryByTestId('pastille')).toBeNull()
    })
  })
})

const renderBookings = () => {
  return render(reactQueryProviderHOC(<Bookings />))
}

const activateFeatureFlags = (activeFeatureFlags: RemoteStoreFeatureFlags[] = []) => {
  useFeatureFlagSpy.mockImplementation((flag) => activeFeatureFlags.includes(flag))
}
