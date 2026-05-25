import { UseQueryResult } from '@tanstack/react-query'
import React from 'react'
import InAppReview from 'react-native-in-app-review'

import { BookingsListResponseV2, SubcategoriesResponseModelv2 } from 'api/gen'
import { availableReactionsSnap } from 'features/bookings/fixtures/availableReactionSnap'
import { endedBookingsV2ListSnap } from 'features/bookings/fixtures/bookingsSnap'
import * as useGoBack from 'features/navigation/useGoBack'
import { UserProfile } from 'features/share/types'
import { beneficiaryUser } from 'fixtures/user'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { appendHistory, clearHistory } from 'libs/reviewInApp/reviewHistory'
import { subcategoriesDataTest } from 'libs/subcategories/fixtures/subcategoriesResponse'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, render, screen, userEvent } from 'tests/utils'

import { EndedBookings } from './EndedBookings'

const mockGoBack = jest.fn()
jest.spyOn(useGoBack, 'useGoBack').mockReturnValue({
  goBack: mockGoBack,
  canGoBack: jest.fn(() => true),
})

jest.mock('libs/firebase/analytics/analytics')

const mockMutate = jest.fn()
jest.mock('features/reactions/queries/useReactionMutation', () => ({
  useReactionMutation: () => ({ mutateAsync: mockMutate }),
}))

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

jest.mock('libs/network/NetInfoWrapper')
jest.mock('features/auth/context/AuthContext', () => ({
  useAuthContext: jest.fn(() => ({ isLoggedIn: true })),
}))

jest.mock('libs/jwt/jwt')

jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({
    resetSearch: jest.fn(),
  }),
}))

jest.mock('react-native-in-app-review')
const mockIsAvailable = InAppReview.isAvailable as jest.Mock
const mockRequestInAppReview = InAppReview.RequestInAppReview as jest.Mock

const user = userEvent.setup()

jest.useFakeTimers()

describe('EndedBookings', () => {
  beforeEach(() => {
    setFeatureFlags()
    mockServer.getApi<UserProfile>('/v1/me', beneficiaryUser)
    mockServer.getApi<SubcategoriesResponseModelv2>('/v1/subcategories/v2', subcategoriesDataTest)
    mockServer.getApi('/v1/reaction/available', availableReactionsSnap)
  })

  it('should render correctly', async () => {
    renderEndedBookings()

    await screen.findByText(endedBookingsV2ListSnap.bookings[0].stock.offer.name)

    expect(screen).toMatchSnapshot()
  })

  it('should send reaction from cinema offer', async () => {
    renderEndedBookings()

    await user.press(await screen.findByLabelText('Réagis à ta réservation'))

    await user.press(await screen.findByText('J’aime'))
    await user.press(screen.getByText('Valider la réaction'))

    expect(mockMutate).toHaveBeenCalledTimes(1)
  })

  describe('booking_liked review trigger', () => {
    beforeEach(async () => {
      mockIsAvailable.mockReturnValue(true)
      mockRequestInAppReview.mockResolvedValue(true)
      await clearHistory()
    })

    const submitReaction = async (reactionWording: string) => {
      await user.press(await screen.findByLabelText('Réagis à ta réservation'))
      await user.press(await screen.findByText(reactionWording))
      await user.press(screen.getByText('Valider la réaction'))
    }

    it('calls RequestInAppReview after 3s when a Like is submitted and the flag is on', async () => {
      setFeatureFlags([RemoteStoreFeatureFlags.WIP_REVIEW_TRIGGER_LIKE])
      renderEndedBookings()

      await submitReaction('J’aime')
      await act(async () => {
        jest.advanceTimersByTime(3000)
      })

      expect(mockRequestInAppReview).toHaveBeenCalledTimes(1)
    })

    it('does not call RequestInAppReview when the system was already prompted less than 30 days ago', async () => {
      setFeatureFlags([RemoteStoreFeatureFlags.WIP_REVIEW_TRIGGER_LIKE])
      await appendHistory(Date.now() - 10 * 24 * 60 * 60 * 1000)
      renderEndedBookings()

      await submitReaction('J’aime')
      await act(async () => {
        jest.advanceTimersByTime(3000)
      })

      expect(mockRequestInAppReview).not.toHaveBeenCalled()
    })

    it('does not call RequestInAppReview when the flag is off', async () => {
      setFeatureFlags([])
      renderEndedBookings()

      await submitReaction('J’aime')
      await act(async () => {
        jest.advanceTimersByTime(3000)
      })

      expect(mockRequestInAppReview).not.toHaveBeenCalled()
    })

    it('does not call RequestInAppReview when the reaction is not a Like', async () => {
      setFeatureFlags([RemoteStoreFeatureFlags.WIP_REVIEW_TRIGGER_LIKE])
      renderEndedBookings()

      await submitReaction('Je n’aime pas')
      await act(async () => {
        jest.advanceTimersByTime(3000)
      })

      expect(mockRequestInAppReview).not.toHaveBeenCalled()
    })
  })
})

const renderEndedBookings = () => {
  const mockUseEndedBookingsQuery = () =>
    ({
      data: { bookings: endedBookingsV2ListSnap.bookings },
      isLoading: false,
      isError: false,
      isFetching: false,
      isRefetching: false,
      refetch: jest.fn(),
    }) as unknown as UseQueryResult<BookingsListResponseV2, Error>

  return render(
    reactQueryProviderHOC(<EndedBookings useEndedBookingsQuery={mockUseEndedBookingsQuery} />)
  )
}
