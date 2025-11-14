import React from 'react'

import { dispatch, reset, useRoute } from '__mocks__/@react-navigation/native'
import { ApiError } from 'api/ApiError'
import { ActivityIdEnum } from 'api/gen'
import { initialSubscriptionState as mockState } from 'features/identityCheck/context/reducer'
import { ActivationProfileRecap } from 'features/identityCheck/pages/profile/ActivationProfileRecap'
import { ProfileTypes } from 'features/identityCheck/pages/profile/enums'
import { useAddress } from 'features/identityCheck/pages/profile/store/addressStore'
import { useCity } from 'features/identityCheck/pages/profile/store/cityStore'
import { useName } from 'features/identityCheck/pages/profile/store/nameStore'
import * as resetStores from 'features/identityCheck/pages/profile/store/resetProfileStores'
import { useStatus } from 'features/identityCheck/pages/profile/store/statusStore'
import * as usePostProfileMutation from 'features/identityCheck/queries/usePostProfileMutation'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
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

const mockStatus = ActivityIdEnum.STUDENT
const profile = {
  name: { firstName: 'Jean', lastName: 'Dupont' },
  city: { name: 'Paris', postalCode: '75011' },
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

jest.mock('features/identityCheck/pages/profile/store/statusStore')
;(useStatus as jest.Mock).mockReturnValue(profile.status)

let mockOfferId: number | null = 123456
jest.mock('features/offer/store/freeOfferIdStore', () => ({
  useFreeOfferId: () => mockOfferId,
}))

jest.mock('features/identityCheck/context/SubscriptionContextProvider', () => ({
  useSubscriptionContext: jest.fn(() => ({
    dispatch: jest.fn(),
    ...mockState,
    profile: {
      name: { firstName: 'Jean', lastName: 'Dupont' },
      city: { name: 'Paris', postalCode: '75011' },
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

const mockRefetchUser = jest.fn()
jest.mock('features/auth/context/AuthContext', () => ({
  useAuthContext: jest.fn(() => ({ refetchUser: mockRefetchUser })),
}))

const user = userEvent.setup()

describe('<ActivationProfileRecap />', () => {
  beforeEach(async () => {
    setFeatureFlags()
    mockServer.postApi('/v1/subscription/profile', {})
  })

  it('should render correctly', () => {
    renderActivationProfileRecap()

    expect(screen).toMatchSnapshot()
  })

  it('should display user info correctly', () => {
    renderActivationProfileRecap()

    expect(screen.getByText('DUPONT')).toBeTruthy()
    expect(screen.getByText('Jean')).toBeTruthy()
    expect(screen.getByText('1 rue du désespoir')).toBeTruthy()
    expect(screen.getByText('Paris 75011')).toBeTruthy()
    expect(screen.getByText('Étudiant')).toBeTruthy()
  })

  it('should display correct infos in identity check', async () => {
    renderActivationProfileRecap()

    expect(await screen.findByText('Profil')).toBeTruthy()
  })

  it('should display correct infos in booking free offer 15/16 years', async () => {
    useRoute.mockReturnValueOnce({ params: { type: ProfileTypes.BOOKING_FREE_OFFER_15_16 } })
    renderActivationProfileRecap()

    expect(await screen.findByText('Informations personnelles')).toBeTruthy()
  })

  it('should navigate to stepper on press "Confirmer"', async () => {
    renderActivationProfileRecap()

    await user.press(screen.getByText('Confirmer'))

    expect(dispatch).toHaveBeenCalledWith({
      payload: {
        index: 1,
        routes: [
          { name: 'TabNavigator' },
          { name: 'SubscriptionStackNavigator', state: { routes: [{ name: 'Stepper' }] } },
        ],
      },
      type: 'RESET',
    })
  })

  it('should not navigate to Offer screen if booking free offer and offer ID exists but FF ENABLE_BOOKING_FREE_OFFER_15_16 is disable', async () => {
    renderActivationProfileRecap()

    await user.press(screen.getByText('Confirmer'))

    expect(reset).not.toHaveBeenCalled()
  })

  it('should navigate to Offer screen if booking free offer and offer ID exists when FF ENABLE_BOOKING_FREE_OFFER_15_16 is enable', async () => {
    useRoute.mockReturnValueOnce({ params: { type: ProfileTypes.BOOKING_FREE_OFFER_15_16 } })
    setFeatureFlags([RemoteStoreFeatureFlags.ENABLE_BOOKING_FREE_OFFER_15_16])

    renderActivationProfileRecap()

    await user.press(screen.getByText('Confirmer'))

    expect(reset).toHaveBeenCalledWith({
      routes: [{ name: 'Offer', params: { id: mockOfferId } }],
    })
  })

  it('should not navigate to Offer screen when booking free offer but no offer ID is stored with FF ENABLE_BOOKING_FREE_OFFER_15_16 is disable', async () => {
    renderActivationProfileRecap()
    mockOfferId = null

    await user.press(screen.getByText('Confirmer'))

    expect(reset).not.toHaveBeenCalled()
  })

  it('should navigate to error screen when booking free offer but no offer ID is stored with FF ENABLE_BOOKING_FREE_OFFER_15_16 is enable', async () => {
    useRoute.mockReturnValueOnce({ params: { type: ProfileTypes.BOOKING_FREE_OFFER_15_16 } })
    setFeatureFlags([RemoteStoreFeatureFlags.ENABLE_BOOKING_FREE_OFFER_15_16])
    mockOfferId = null
    renderActivationProfileRecap()

    await user.press(screen.getByText('Confirmer'))

    expect(reset).toHaveBeenCalledWith({
      routes: [
        {
          name: 'SubscriptionStackNavigator',
          state: { routes: [{ name: 'SetProfileBookingError' }] },
        },
      ],
    })
  })

  it('should reset profile stores after submission succeeds', async () => {
    const resetStoresSpy = jest.spyOn(resetStores, 'resetProfileStores')
    renderActivationProfileRecap()

    await user.press(screen.getByText('Confirmer'))

    await waitFor(() => expect(resetStoresSpy).toHaveBeenCalledTimes(1))
  })

  it('should call refetchUser after submission succeeds', async () => {
    renderActivationProfileRecap()

    await user.press(screen.getByText('Confirmer'))

    await waitFor(() => expect(mockRefetchUser).toHaveBeenCalledTimes(1))
  })

  it('should navigate to error screen if posting profile fails', async () => {
    mockUseMutationError({ content: {}, name: 'ApiError', statusCode: 400, message: 'erreur' })
    useRoute.mockReturnValueOnce({ params: { type: ProfileTypes.BOOKING_FREE_OFFER_15_16 } })
    setFeatureFlags([RemoteStoreFeatureFlags.ENABLE_BOOKING_FREE_OFFER_15_16])
    mockOfferId = 1

    renderActivationProfileRecap()

    await user.press(screen.getByText('Confirmer'))

    expect(reset).toHaveBeenCalledWith({
      routes: [
        {
          name: 'SubscriptionStackNavigator',
          state: { routes: [{ name: 'SetProfileBookingError', params: { offerId: mockOfferId } }] },
        },
      ],
    })
  })
})

const renderActivationProfileRecap = () => {
  return render(reactQueryProviderHOC(<ActivationProfileRecap />))
}
