import React from 'react'

import { dispatch, reset, useRoute } from '__mocks__/@react-navigation/native'
import { ApiError } from 'api/ApiError'
import { ActivityIdEnum } from 'api/gen'
import { initialSubscriptionState as mockState } from 'features/identityCheck/context/reducer'
import { ProfileTypes } from 'features/identityCheck/pages/profile/enums'
import { ActivityTypesSnap } from 'features/identityCheck/pages/profile/fixtures/mockedActivityTypes'
import { SetStatus } from 'features/identityCheck/pages/profile/SetStatus'
import { useAddress } from 'features/identityCheck/pages/profile/store/addressStore'
import { useCity } from 'features/identityCheck/pages/profile/store/cityStore'
import { useName } from 'features/identityCheck/pages/profile/store/nameStore'
import * as resetStores from 'features/identityCheck/pages/profile/store/resetProfileStores'
import * as usePostProfileMutation from 'features/identityCheck/queries/usePostProfileMutation'
import * as UnderageUserAPI from 'features/profile/helpers/useIsUserUnderage'
import { analytics } from 'libs/analytics/provider'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { storage } from 'libs/storage'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent, waitFor } from 'tests/utils'
import { SnackBarHelperSettings } from 'ui/components/snackBar/types'

const usePostProfileMutationSpy = jest.spyOn(usePostProfileMutation, 'usePostProfileMutation')

const mockUseMutationError = (error?: ApiError) => {
  // @ts-ignore we don't use the other properties of UseMutationResult (such as failureCount)
  usePostProfileMutationSpy.mockImplementation(({ onError }) => ({
    // @ts-ignore it's a mock
    mutateAsync: jest.fn(() => onError(error)),
  }))
}

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

let mockOfferId: number | null = 123456
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

const mockShowErrorSnackBar = jest.fn()
jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: () => ({
    showErrorSnackBar: jest.fn((props: SnackBarHelperSettings) => mockShowErrorSnackBar(props)),
  }),
}))

const mockActivities = ActivityTypesSnap.activities
jest.mock('features/identityCheck/api/useActivityTypes', () => {
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
    // eslint-disable-next-line local-rules/independent-mocks
    useRoute.mockReturnValue({
      params: { type: ProfileTypes.BOOKING_FREE_OFFER_15_16 },
    })
    renderSetStatus()

    expect(await screen.findByText('Informations personnelles')).toBeTruthy()
  })

  it('should navigate to stepper on press "Continuer"', async () => {
    mockStatus = ActivityTypesSnap.activities[2].id
    renderSetStatus()

    await user.press(screen.getByText(ActivityTypesSnap.activities[2].label)) // select student status

    await user.press(screen.getByText('Continuer'))

    expect(dispatch).toHaveBeenCalledWith({
      payload: { index: 1, routes: [{ name: 'TabNavigator' }, { name: 'Stepper' }] },
      type: 'RESET',
    })
  })

  it('should log analytics on press Continuer', async () => {
    renderSetStatus()

    await user.press(screen.getByText(ActivityTypesSnap.activities[1].label))
    await user.press(screen.getByText('Continuer'))

    expect(analytics.logSetStatusClicked).toHaveBeenCalledTimes(1)
  })

  it('should not navigate to Offer screen if booking free offer and offer ID exists but FF ENABLE_BOOKING_FREE_OFFER_15_16 is disable', async () => {
    mockStatus = ActivityTypesSnap.activities[0].id

    renderSetStatus()

    await user.press(screen.getByText(ActivityTypesSnap.activities[0].label))
    await user.press(screen.getByText('Continuer'))

    expect(reset).not.toHaveBeenCalled()
  })

  it('should navigate to Offer screen if booking free offer and offer ID exists when FF ENABLE_BOOKING_FREE_OFFER_15_16 is enable', async () => {
    setFeatureFlags([RemoteStoreFeatureFlags.ENABLE_BOOKING_FREE_OFFER_15_16])
    mockStatus = ActivityTypesSnap.activities[0].id

    renderSetStatus()

    await user.press(screen.getByText(ActivityTypesSnap.activities[0].label))
    await user.press(screen.getByText('Continuer'))

    expect(reset).toHaveBeenCalledWith({
      routes: [{ name: 'Offer', params: { id: mockOfferId } }],
    })
  })

  it('should not navigate to Offer screen when booking free offer but no offer ID is stored with FF ENABLE_BOOKING_FREE_OFFER_15_16 is disable', async () => {
    mockStatus = ActivityTypesSnap.activities[0].id
    mockOfferId = null

    renderSetStatus()

    await user.press(screen.getByText(ActivityTypesSnap.activities[0].label))
    await user.press(screen.getByText('Continuer'))

    expect(reset).not.toHaveBeenCalled()
  })

  it('should navigate to error screen when booking free offer but no offer ID is stored with FF ENABLE_BOOKING_FREE_OFFER_15_16 is enable', async () => {
    setFeatureFlags([RemoteStoreFeatureFlags.ENABLE_BOOKING_FREE_OFFER_15_16])
    mockStatus = ActivityTypesSnap.activities[0].id
    mockOfferId = null

    renderSetStatus()

    await user.press(screen.getByText(ActivityTypesSnap.activities[0].label))
    await user.press(screen.getByText('Continuer'))

    expect(reset).toHaveBeenCalledWith({ routes: [{ name: 'SetProfileBookingError' }] })
  })

  it('should reset profile stores after submission succeeds', async () => {
    const resetStoresSpy = jest.spyOn(resetStores, 'resetProfileStores')

    renderSetStatus()

    await user.press(screen.getByText(ActivityTypesSnap.activities[1].label))
    await user.press(screen.getByText('Continuer'))

    await waitFor(() => {
      expect(resetStoresSpy).toHaveBeenCalledTimes(1)
    })
  })

  it('should call refetchUser after submission succeeds', async () => {
    renderSetStatus()

    await user.press(screen.getByText(ActivityTypesSnap.activities[1].label))
    await user.press(screen.getByText('Continuer'))

    await waitFor(() => {
      expect(mockRefetchUser).toHaveBeenCalledTimes(1)
    })
  })

  it('should navigate to error screen if posting profile fails', async () => {
    mockUseMutationError({
      content: {},
      name: 'ApiError',
      statusCode: 400,
      message: 'erreur',
    })
    setFeatureFlags([RemoteStoreFeatureFlags.ENABLE_BOOKING_FREE_OFFER_15_16])
    mockStatus = ActivityTypesSnap.activities[0].id
    mockOfferId = 1

    renderSetStatus()

    await user.press(screen.getByText(ActivityTypesSnap.activities[0].label))
    await user.press(screen.getByText('Continuer'))

    expect(reset).toHaveBeenCalledWith({
      routes: [{ name: 'SetProfileBookingError', params: { offerId: mockOfferId } }],
    })
  })

  it('should save status in local storage when clicking on status', async () => {
    renderSetStatus()

    await user.press(screen.getByText(ActivityTypesSnap.activities[1].label))

    expect(await storage.readObject('profile-status')).toMatchObject({
      state: {
        status: ActivityTypesSnap.activities[1].id,
      },
    })
  })
})

const renderSetStatus = () => {
  return render(reactQueryProviderHOC(<SetStatus />))
}
