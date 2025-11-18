import React from 'react'

import { dispatch, reset, useRoute } from '__mocks__/@react-navigation/native'
import { ApiError } from 'api/ApiError'
import { ActivityIdEnum } from 'api/gen'
import { ActivationProfileRecap } from 'features/identityCheck/pages/profile/ActivationProfileRecap'
import { ProfileTypes } from 'features/identityCheck/pages/profile/enums'
import { addressActions } from 'features/identityCheck/pages/profile/store/addressStore'
import { cityActions } from 'features/identityCheck/pages/profile/store/cityStore'
import { nameActions } from 'features/identityCheck/pages/profile/store/nameStore'
import * as resetProfileStores from 'features/identityCheck/pages/profile/store/resetProfileStores'
import { statusActions } from 'features/identityCheck/pages/profile/store/statusStore'
import * as usePostProfileMutation from 'features/identityCheck/queries/usePostProfileMutation'
import { freeOfferIdActions } from 'features/offer/store/freeOfferIdStore'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent, waitFor } from 'tests/utils'

const usePostProfileMutationSpy = jest.spyOn(usePostProfileMutation, 'usePostProfileMutation')

const mockUseMutationError = (error?: ApiError) => {
  // @ts-ignore we don't use the other properties of UseMutationResult (such as failureCount)
  usePostProfileMutationSpy.mockImplementation(({ onError }) => ({
    // @ts-ignore it's a mock
    mutateAsync: jest.fn(() => onError(error)),
  }))
}

const mockUseMutationSuccess = () => {
  // @ts-ignore we don't use the other properties of UseMutationResult (such as failureCount)
  usePostProfileMutationSpy.mockImplementation(({ onSuccess }) => ({
    // @ts-ignore it's a mock
    mutateAsync: jest.fn(() => onSuccess?.()),
  }))
}

const firstName = 'Jean'
const lastName = 'Dupont'
const cityName = 'Paris'
const postalCode = '75011'
const address = '1 rue du désespoir'
const status = ActivityIdEnum.STUDENT
const offerId = 1234
const offerIdNull = null

jest.mock('libs/jwt/jwt')

jest.mock('features/identityCheck/context/SubscriptionContextProvider', () => ({
  useSubscriptionContext: jest.fn(() => ({ dispatch: jest.fn() })),
}))

const mockRefetchUser = jest.fn()
jest.mock('features/auth/context/AuthContext', () => ({
  useAuthContext: jest.fn(() => ({ refetchUser: mockRefetchUser })),
}))

const user = userEvent.setup()

describe('<ActivationProfileRecap />', () => {
  beforeEach(() => {
    resetProfileStores.resetProfileStores()
    setFeatureFlags()
    mockUseMutationSuccess()
  })

  it('should render correctly', () => {
    prepareDataAndRender(firstName, lastName, cityName, postalCode, address, status, offerId)

    expect(screen).toMatchSnapshot()
  })

  it('should display user info correctly', () => {
    prepareDataAndRender(firstName, lastName, cityName, postalCode, address, status, offerId)

    expect(screen.getByText('DUPONT')).toBeTruthy()
    expect(screen.getByText('Jean')).toBeTruthy()
    expect(screen.getByText('1 rue du désespoir')).toBeTruthy()
    expect(screen.getByText('Paris 75011')).toBeTruthy()
    expect(screen.getByText('Étudiant')).toBeTruthy()
  })

  it('should display correct infos in identity check', async () => {
    prepareDataAndRender(firstName, lastName, cityName, postalCode, address, status, offerId)

    expect(await screen.findByText('Profil')).toBeTruthy()
  })

  it('should navigate to stepper on press "Confirmer"', async () => {
    prepareDataAndRender(firstName, lastName, cityName, postalCode, address, status, offerId)

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

  it('should reset profile stores after submission succeeds', async () => {
    const resetStoresSpy = jest.spyOn(resetProfileStores, 'resetProfileStores')
    prepareDataAndRender(firstName, lastName, cityName, postalCode, address, status, offerId)

    await user.press(screen.getByText('Confirmer'))

    await waitFor(() => expect(resetStoresSpy).toHaveBeenCalledTimes(1))
  })

  it('should call refetchUser after submission succeeds', async () => {
    prepareDataAndRender(firstName, lastName, cityName, postalCode, address, status, offerId)

    await user.press(screen.getByText('Confirmer'))

    await waitFor(() => expect(mockRefetchUser).toHaveBeenCalledTimes(1))
  })

  it('should navigate to error screen if posting profile fails', async () => {
    mockUseMutationError({ content: {}, name: 'ApiError', statusCode: 400, message: 'erreur' })
    useRoute.mockReturnValueOnce({ params: { type: ProfileTypes.BOOKING_FREE_OFFER_15_16 } })
    setFeatureFlags([RemoteStoreFeatureFlags.ENABLE_BOOKING_FREE_OFFER_15_16])
    prepareDataAndRender(firstName, lastName, cityName, postalCode, address, status, offerId)

    await user.press(screen.getByText('Confirmer'))

    expect(reset).toHaveBeenCalledWith({
      routes: [
        {
          name: 'SubscriptionStackNavigator',
          state: { routes: [{ name: 'SetProfileBookingError', params: { offerId } }] },
        },
      ],
    })
  })

  describe('booking free offer 15-16 years', () => {
    beforeEach(() => {
      setFeatureFlags([RemoteStoreFeatureFlags.ENABLE_BOOKING_FREE_OFFER_15_16])
      useRoute.mockReturnValueOnce({ params: { type: ProfileTypes.BOOKING_FREE_OFFER_15_16 } })
    })

    it('should display correct infos in booking free offer 15-16 years', async () => {
      prepareDataAndRender(firstName, lastName, cityName, postalCode, address, status, offerId)

      expect(await screen.findByText('Informations personnelles')).toBeTruthy()
    })

    it('should not navigate to Offer screen if booking free offer and offer ID exists but FF ENABLE_BOOKING_FREE_OFFER_15_16 is disable', async () => {
      setFeatureFlags()
      prepareDataAndRender(firstName, lastName, cityName, postalCode, address, status, offerId)

      await user.press(screen.getByText('Confirmer'))

      expect(reset).not.toHaveBeenCalled()
    })

    it('should navigate to Offer screen if booking free offer and offer ID exists when FF ENABLE_BOOKING_FREE_OFFER_15_16 is enable', async () => {
      prepareDataAndRender(firstName, lastName, cityName, postalCode, address, status, offerId)

      await user.press(screen.getByText('Confirmer'))

      await waitFor(() => {
        expect(reset).toHaveBeenCalledWith({ routes: [{ name: 'Offer', params: { id: offerId } }] })
      })
    })

    it('should not navigate to Offer screen when booking free offer but no offer ID is stored with FF ENABLE_BOOKING_FREE_OFFER_15_16 is disable', async () => {
      setFeatureFlags()
      prepareDataAndRender(firstName, lastName, cityName, postalCode, address, status, offerIdNull)

      await user.press(screen.getByText('Confirmer'))

      expect(reset).not.toHaveBeenCalled()
    })

    it('should navigate to error screen when booking free offer but no offer ID is stored with FF ENABLE_BOOKING_FREE_OFFER_15_16 is enable', async () => {
      prepareDataAndRender(firstName, lastName, cityName, postalCode, address, status, offerIdNull)

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
  })
})

function prepareDataAndRender(firstName, lastName, cityName, postalCode, address, status, offerId) {
  const { setName } = nameActions
  const { setCity } = cityActions
  const { setAddress } = addressActions
  const { setStatus } = statusActions
  const { setFreeOfferId } = freeOfferIdActions

  setName({ firstName, lastName })
  setCity({ name: cityName, postalCode, code: 'PARIS_CODE', departementCode: '75' })
  setAddress(address)
  setStatus(status)
  setFreeOfferId(offerId)

  render(reactQueryProviderHOC(<ActivationProfileRecap />))
}
