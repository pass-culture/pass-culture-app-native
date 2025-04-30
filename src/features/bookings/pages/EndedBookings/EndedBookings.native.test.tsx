import React from 'react'

import { BookingsResponse, SubcategoriesResponseModelv2, UserProfileResponse } from 'api/gen'
import { availableReactionsSnap } from 'features/bookings/fixtures/availableReactionSnap'
import { bookingsSnap } from 'features/bookings/fixtures/bookingsSnap'
import * as useGoBack from 'features/navigation/useGoBack'
import { beneficiaryUser } from 'fixtures/user'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { subcategoriesDataTest } from 'libs/subcategories/fixtures/subcategoriesResponse'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent } from 'tests/utils'

import { EndedBookings } from './EndedBookings'

jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

const mockGoBack = jest.fn()
jest.spyOn(useGoBack, 'useGoBack').mockReturnValue({
  goBack: mockGoBack,
  canGoBack: jest.fn(() => true),
})

jest.mock('libs/firebase/analytics/analytics')

const mockMutate = jest.fn()
jest.mock('features/reactions/queries/useReactionMutation', () => ({
  useReactionMutation: () => ({ mutate: mockMutate }),
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

const user = userEvent.setup()

jest.useFakeTimers()

describe('EndedBookings', () => {
  beforeEach(() => {
    setFeatureFlags()
    mockServer.getApi<UserProfileResponse>('/v1/me', beneficiaryUser)
    mockServer.getApi<BookingsResponse>('/v1/bookings', bookingsSnap)
    mockServer.getApi<SubcategoriesResponseModelv2>('/v1/subcategories/v2', subcategoriesDataTest)
    mockServer.getApi('/v1/reaction/available', availableReactionsSnap)
  })

  it('should render correctly', async () => {
    renderEndedBookings()

    await screen.findAllByText('Avez-vous déjà vu\u00a0?')

    expect(screen).toMatchSnapshot()
  })

  describe('with reaction feature flag activated', () => {
    beforeEach(() => {
      setFeatureFlags([RemoteStoreFeatureFlags.WIP_REACTION_FEATURE])
    })

    it('should send reaction from cinema offer', async () => {
      renderEndedBookings()

      await user.press(await screen.findByLabelText('Réagis à ta réservation'))

      await user.press(await screen.findByText('J’aime'))
      await user.press(screen.getByText('Valider la réaction'))

      expect(mockMutate).toHaveBeenCalledTimes(1)
    })
  })
})

const renderEndedBookings = () => {
  return render(reactQueryProviderHOC(<EndedBookings />))
}
