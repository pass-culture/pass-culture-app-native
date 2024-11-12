import React, { Fragment, FunctionComponent } from 'react'

import { BookingsResponse, SubcategoriesResponseModelv2, UserProfileResponse } from 'api/gen'
import { bookingsSnap } from 'features/bookings/fixtures/bookingsSnap'
import * as useGoBack from 'features/navigation/useGoBack'
import { beneficiaryUser } from 'fixtures/user'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { RemoteConfigProvider } from 'libs/firebase/remoteConfig/RemoteConfigProvider'
import { subcategoriesDataTest } from 'libs/subcategories/fixtures/subcategoriesResponse'
import { mockServer } from 'tests/mswServer'
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
const activateFeatureFlags = (activeFeatureFlags: RemoteStoreFeatureFlags[] = []) => {
  useFeatureFlagSpy.mockImplementation((flag) => activeFeatureFlags.includes(flag))
}

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

describe('EndedBookings', () => {
  beforeEach(() => {
    mockServer.getApi<UserProfileResponse>('/v1/me', beneficiaryUser)
    mockServer.getApi<BookingsResponse>('/v1/bookings', bookingsSnap)
    mockServer.getApi<SubcategoriesResponseModelv2>('/v1/subcategories/v2', subcategoriesDataTest)
  })

  it('should render correctly', async () => {
    renderEndedBookings()

    await screen.findAllByText('Avez-vous déjà vu\u00a0?')

    expect(screen).toMatchSnapshot()
  })

  it('should display the right number of ended bookings', async () => {
    renderEndedBookings()

    expect(await screen.findByText('2 réservations terminées')).toBeOnTheScreen()
  })

  it('should goBack when we press on the back button', async () => {
    renderEndedBookings()

    await screen.findAllByText('Avez-vous déjà vu\u00a0?')

    fireEvent.press(screen.getByTestId('Revenir en arrière'))

    expect(mockGoBack).toHaveBeenCalledTimes(1)
  })

  describe('with feature flag activated', () => {
    beforeEach(() => {
      activateFeatureFlags([
        RemoteStoreFeatureFlags.WIP_BOOKING_IMPROVE,
        RemoteStoreFeatureFlags.WIP_REACTION_FEATURE,
      ])
    })

    it('should send reaction from cinema offer', async () => {
      renderEndedBookings(RemoteConfigProvider)

      fireEvent.press(await screen.findByLabelText('Réagis à ta réservation'))

      fireEvent.press(await screen.findByText('J’aime'))
      fireEvent.press(screen.getByText('Valider la réaction'))

      await waitFor(() => {
        expect(mockMutate).toHaveBeenCalledTimes(1)
      })
    })
  })
})

const renderEndedBookings = (Wrapper: FunctionComponent<{ children: JSX.Element }> = Fragment) => {
  return render(<Wrapper>{reactQueryProviderHOC(<EndedBookings />)}</Wrapper>)
}
