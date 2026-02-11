import React from 'react'

import { navigate, useRoute } from '__mocks__/@react-navigation/native'
import { ActivityIdEnum } from 'api/gen'
import { initialSubscriptionState as mockState } from 'features/identityCheck/context/reducer'
import { ProfileTypes } from 'features/identityCheck/pages/profile/enums'
import { ActivityTypesSnap } from 'features/identityCheck/pages/profile/fixtures/mockedActivityTypes'
import { SetStatus } from 'features/identityCheck/pages/profile/SetStatus'
import { useAddress } from 'features/identityCheck/pages/profile/store/addressStore'
import { useCity } from 'features/identityCheck/pages/profile/store/cityStore'
import { useName } from 'features/identityCheck/pages/profile/store/nameStore'
import * as UnderageUserAPI from 'features/profile/helpers/useIsUserUnderage'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { storage } from 'libs/storage'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent, waitFor } from 'tests/utils'

let mockStatus: ActivityIdEnum | null = null

const profile = {
  name: {
    firstName: 'Jean',
    lastName: 'Dupont',
  },
  city: {
    name: 'Paris',
    postalCode: '75011',
  },
  address: '1 rue du désespoir',
  status: mockStatus,
}

jest.mock('libs/jwt/jwt')
jest.mock('features/identityCheck/pages/profile/store/nameStore')
;(useName as jest.Mock).mockReturnValue(profile.name)

jest.mock('features/identityCheck/pages/profile/store/cityStore')
;(useCity as jest.Mock).mockReturnValue(profile.city)

jest.mock('features/identityCheck/pages/profile/store/addressStore')
;(useAddress as jest.Mock).mockReturnValue(profile.address)

const mockOfferId: number | null = 123456
jest.mock('features/offer/store/freeOfferIdStore', () => ({
  useFreeOfferId: () => mockOfferId,
}))

jest.mock('features/identityCheck/context/SubscriptionContextProvider', () => ({
  useSubscriptionContext: jest.fn(() => ({
    dispatch: jest.fn(),
    ...mockState,
    profile: {
      name: {
        firstName: 'Jean',
        lastName: 'Dupont',
      },
      city: {
        name: 'Paris',
        postalCode: '75011',
      },
      address: '1 rue du désespoir',
      status: mockStatus,
    },
  })),
}))

const mockActivities = ActivityTypesSnap.activities
jest.mock('features/identityCheck/queries/useActivityTypesQuery', () => {
  return {
    useActivityTypes: jest.fn(() => {
      return {
        activities: mockActivities,
      }
    }),
  }
})

jest.mock('features/profile/helpers/useIsUserUnderage')
const mockedUseIsUserUnderage = jest.spyOn(UnderageUserAPI, 'useIsUserUnderage')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const mockRefetchUser = jest.fn()
jest.mock('features/auth/context/AuthContext', () => ({
  useAuthContext: jest.fn(() => ({ refetchUser: mockRefetchUser })),
}))

const user = userEvent.setup()

jest.useFakeTimers()

describe('<SetStatus/>', () => {
  beforeEach(async () => {
    setFeatureFlags()
    mockServer.postApi('/v1/subscription/profile', {})
  })

  it('should render correctly', async () => {
    mockedUseIsUserUnderage.mockReturnValueOnce(true)
    // eslint-disable-next-line local-rules/independent-mocks
    useRoute.mockReturnValue({
      params: { type: ProfileTypes.IDENTITY_CHECK },
    })
    renderSetStatus()

    await waitFor(() => expect(screen).toMatchSnapshot())
  })

  it('should display correct infos in identity check', async () => {
    renderSetStatus()

    expect(await screen.findByText('Profil')).toBeTruthy()
  })

  it('should display correct infos in booking free offer 15/16 years', async () => {
    useRoute.mockReturnValueOnce({ params: { type: ProfileTypes.BOOKING_FREE_OFFER_15_16 } })
    renderSetStatus()

    expect(await screen.findByText('Informations personnelles')).toBeTruthy()
  })

  it('should navigate to stepper on press "Continuer"', async () => {
    mockStatus = ActivityTypesSnap.activities[2].id
    renderSetStatus()

    await user.press(screen.getByText(ActivityTypesSnap.activities[2].label)) // select student status

    await user.press(screen.getByText('Continuer'))

    expect(navigate).toHaveBeenNthCalledWith(1, 'SubscriptionStackNavigator', {
      params: { type: ProfileTypes.IDENTITY_CHECK },
      screen: 'ActivationProfileRecap',
    })
  })

  it('should save status in local storage when clicking on status', async () => {
    renderSetStatus()

    await user.press(screen.getByText(ActivityTypesSnap.activities[1].label))

    expect(await storage.readObject('profile-status')).toMatchObject({
      state: { status: ActivityTypesSnap.activities[1].id },
    })
  })
})

const renderSetStatus = () => {
  return render(reactQueryProviderHOC(<SetStatus />))
}
