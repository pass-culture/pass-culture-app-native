import React, { Fragment, FunctionComponent } from 'react'
import { QueryObserverResult } from 'react-query'

import { BookingsResponse } from 'api/gen'
import * as bookingsAPI from 'features/bookings/api/useBookings'
import { bookingsSnap } from 'features/bookings/fixtures/bookingsSnap'
import * as useGoBack from 'features/navigation/useGoBack'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteConfigProvider } from 'libs/firebase/remoteConfig/RemoteConfigProvider'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, screen, waitFor } from 'tests/utils'

import { EndedBookings } from './EndedBookings'

jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

const mockGoBack = jest.fn()
jest.spyOn(useGoBack, 'useGoBack').mockReturnValue({
  goBack: mockGoBack,
  canGoBack: jest.fn(() => true),
})

jest.mock('libs/firebase/analytics/analytics')
const useFeatureFlagSpy = jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(false)

const mockMutate = jest.fn()
jest.mock('features/reactions/api/useReactionMutation', () => ({
  useReactionMutation: () => ({ mutate: mockMutate }),
}))

jest.mock('libs/firebase/remoteConfig/remoteConfig.services', () => ({
  remoteConfig: {
    configure: () => Promise.resolve(true),
    refresh: () => Promise.resolve(true),
    getValues: () => ({
      reactionCategories: { categories: ['SEANCES_DE_CINEMA'] },
    }),
  },
}))

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

jest.mock('@batch.com/react-native-plugin', () =>
  jest.requireActual('__mocks__/libs/react-native-batch')
)

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

describe('EndedBookings', () => {
  it('should render correctly', () => {
    renderEndedBookings(bookingsSnap)

    expect(screen).toMatchSnapshot()
  })

  it('should always execute the query (in cache or in network)', () => {
    const useBookings = jest.spyOn(bookingsAPI, 'useBookings')
    renderEndedBookings(bookingsSnap)

    expect(useBookings).toHaveBeenCalledTimes(1)
  })

  it('should display the right number of ended bookings', () => {
    renderEndedBookings(bookingsSnap)

    expect(screen.getByText('2 réservations terminées')).toBeOnTheScreen()
  })

  it('should goBack when we press on the back button', () => {
    renderEndedBookings(bookingsSnap)

    fireEvent.press(screen.getByTestId('Revenir en arrière'))

    expect(mockGoBack).toHaveBeenCalledTimes(1)
  })

  describe('with feature flag activated', () => {
    beforeEach(() => {
      useFeatureFlagSpy.mockReturnValue(true)
    })

    it('should send reaction from cinema offer', async () => {
      renderEndedBookings(bookingsSnap, RemoteConfigProvider)

      fireEvent.press(await screen.findByLabelText('Réagis à ta réservation'))

      fireEvent.press(await screen.findByText('J’aime'))
      fireEvent.press(screen.getByText('Valider la réaction'))

      await waitFor(() => {
        expect(mockMutate).toHaveBeenCalledTimes(1)
      })
    })
  })
})

const renderEndedBookings = (
  bookings: BookingsResponse,
  Wrapper: FunctionComponent<{ children: JSX.Element }> = Fragment
) => {
  jest
    .spyOn(bookingsAPI, 'useBookings')
    .mockReturnValue({ data: bookings } as QueryObserverResult<BookingsResponse, unknown>)

  return render(
    <Wrapper>{reactQueryProviderHOC(<EndedBookings enableBookingImprove={false} />)}</Wrapper>
  )
}
