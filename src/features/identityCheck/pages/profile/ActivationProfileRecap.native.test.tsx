import React from 'react'

import { dispatch, reset, useRoute } from '__mocks__/@react-navigation/native'
import { ApiError } from 'api/ApiError'
import { ActivityIdEnum } from 'api/gen'
import { ActivationProfileRecap } from 'features/identityCheck/pages/profile/ActivationProfileRecap'
import { ProfileTypes } from 'features/identityCheck/pages/profile/enums'
import { addressActions } from 'features/identityCheck/pages/profile/store/addressStore'
import { cityActions } from 'features/identityCheck/pages/profile/store/cityStore'
import { nameActions } from 'features/identityCheck/pages/profile/store/nameStore'
import { phoneNumberActions } from 'features/identityCheck/pages/profile/store/phoneNumberStore'
import * as resetProfileStores from 'features/identityCheck/pages/profile/store/resetProfileStores'
import { statusActions } from 'features/identityCheck/pages/profile/store/statusStore'
import { ProfileOrigin } from 'features/identityCheck/pages/profile/types'
import * as usePostProfileMutation from 'features/identityCheck/queries/usePostProfileMutation'
import { beneficiaryUserV2, eligibleUserV2 } from 'fixtures/user'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent, waitFor } from 'tests/utils'
import * as snackBarStore from 'ui/designSystem/Snackbar/snackBar.store'

const usePostProfileMutationSpy = jest.spyOn(usePostProfileMutation, 'usePostProfileMutation')
const mockShowSuccessSnackBar = jest.spyOn(snackBarStore, 'showSuccessSnackBar')

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
const phoneNumber = '0601020304'
const offerId = '123456'

jest.mock('libs/jwt/jwt')

jest.mock('features/identityCheck/context/SubscriptionContextProvider', () => ({
  useSubscriptionContext: jest.fn(() => ({ dispatch: jest.fn() })),
}))

const mockRefetchUser = jest.fn()
jest.mock('features/auth/context/AuthContext', () => ({
  useAuthContext: jest.fn(() => ({ refetchUser: mockRefetchUser, user: null })),
}))

const mockUseAuthContext = jest.requireMock('features/auth/context/AuthContext').useAuthContext

const user = userEvent.setup()

describe('<ActivationProfileRecap />', () => {
  beforeEach(() => {
    useRoute.mockReset()
    useRoute.mockReturnValue({ params: { type: ProfileTypes.IDENTITY_CHECK } })
    resetProfileStores.resetProfileStores()
    mockUseMutationSuccess()
    mockShowSuccessSnackBar.mockClear()
    jest.clearAllMocks()
    setFeatureFlags()
    mockUseMutationSuccess()
    mockUseAuthContext.mockReturnValue({
      refetchUser: mockRefetchUser,
      user: null,
    })
  })

  it('should render correctly', () => {
    prepareDataAndRender({
      firstName,
      lastName,
      cityName,
      postalCode,
      address,
      phoneNumber,
      status,
    })

    expect(screen).toMatchSnapshot()
  })

  it('should display user info correctly', () => {
    prepareDataAndRender({
      firstName,
      lastName,
      cityName,
      postalCode,
      address,
      phoneNumber,
      status,
    })

    expect(screen.getByText('DUPONT')).toBeTruthy()
    expect(screen.getByText('Jean')).toBeTruthy()
    expect(screen.getByText('1 rue du désespoir')).toBeTruthy()
    expect(screen.getByText('Paris 75011')).toBeTruthy()
    expect(screen.getByText('Étudiant')).toBeTruthy()
  })

  it('should display correct infos in identity check', async () => {
    prepareDataAndRender({
      firstName,
      lastName,
      cityName,
      postalCode,
      address,
      phoneNumber,
      status,
    })

    expect(await screen.findByText('Profil')).toBeTruthy()
  })

  it('should navigate to stepper on press "Confirmer"', async () => {
    prepareDataAndRender({
      firstName,
      lastName,
      cityName,
      postalCode,
      address,
      phoneNumber,
      status,
    })

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
    resetStoresSpy.mockClear()
    prepareDataAndRender({
      firstName,
      lastName,
      cityName,
      postalCode,
      address,
      phoneNumber,
      status,
    })

    await user.press(screen.getByText('Confirmer'))

    await waitFor(() => expect(resetStoresSpy).toHaveBeenCalledTimes(1))
    resetStoresSpy.mockRestore()
  })

  it('should call refetchUser after submission succeeds', async () => {
    prepareDataAndRender({
      firstName,
      lastName,
      cityName,
      postalCode,
      address,
      phoneNumber,
      status,
    })

    await user.press(screen.getByText('Confirmer'))

    await waitFor(() => expect(mockRefetchUser).toHaveBeenCalledTimes(1))
  })

  it('should navigate to error screen if posting profile fails', async () => {
    mockUseMutationError({ content: {}, name: 'ApiError', statusCode: 400, message: 'erreur' })
    useRoute.mockReturnValueOnce({
      params: {
        type: ProfileTypes.BOOKING_FREE_OFFER_15_16,
        origin: ProfileOrigin.OFFER,
      },
    })
    prepareDataAndRender({
      firstName,
      lastName,
      cityName,
      postalCode,
      address,
      phoneNumber,
      status,
    })

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

  describe('booking free offer 15-16 years', () => {
    beforeEach(() => {
      useRoute.mockReturnValue({
        params: {
          type: ProfileTypes.BOOKING_FREE_OFFER_15_16,
          origin: ProfileOrigin.OFFER,
          freeOfferId: offerId,
        },
      })
    })

    it('should display correct infos in booking free offer 15-16 years', async () => {
      prepareDataAndRender({ firstName, lastName, cityName, postalCode, address, status })

      expect(await screen.findByText('Informations personnelles')).toBeOnTheScreen()
    })

    it('should navigate to Offer screen when booking free offer and offer ID exists', async () => {
      prepareDataAndRender({ firstName, lastName, cityName, postalCode, address, status })

      await user.press(screen.getByText('Confirmer'))

      await waitFor(() => {
        expect(reset).toHaveBeenCalledWith({ routes: [{ name: 'Offer', params: { id: offerId } }] })
      })
    })

    it('should not have phone number in recap', async () => {
      prepareDataAndRender({ firstName, lastName, cityName, postalCode, address, status })

      expect(screen.queryByText('Numéro de téléphone')).not.toBeOnTheScreen()
    })

    it('should navigate to error screen when booking free offer but no offer ID is stored', async () => {
      useRoute.mockReturnValueOnce({
        params: {
          type: ProfileTypes.BOOKING_FREE_OFFER_15_16,
          origin: ProfileOrigin.OFFER,
        },
      })
      prepareDataAndRender({
        firstName,
        lastName,
        cityName,
        postalCode,
        address,
        status,
      })

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

  describe('ff WIP_PHONE_NUMBER_IN_PROFILE_STEPPER is enabled', () => {
    beforeEach(() => {
      setFeatureFlags([RemoteStoreFeatureFlags.WIP_PHONE_NUMBER_IN_PROFILE_STEPPER])
      mockUseAuthContext.mockReturnValue({
        refetchUser: mockRefetchUser,
        user: beneficiaryUserV2,
      })
    })

    it('should render correctly', () => {
      prepareDataAndRender({
        firstName,
        lastName,
        cityName,
        postalCode,
        address,
        phoneNumber,
        status,
      })

      expect(screen).toMatchSnapshot()
    })

    it('should display user info correctly', () => {
      prepareDataAndRender({
        firstName,
        lastName,
        cityName,
        postalCode,
        address,
        phoneNumber,
        status,
      })

      expect(screen.getByText('DUPONT')).toBeTruthy()
      expect(screen.getByText('Jean')).toBeTruthy()
      expect(screen.getByText('1 rue du désespoir')).toBeTruthy()
      expect(screen.getByText('Paris 75011')).toBeTruthy()
      expect(screen.getByText('Étudiant')).toBeTruthy()
      expect(screen.getByText('+33601020304')).toBeTruthy()
    })

    it('should display correct infos in identity check', async () => {
      prepareDataAndRender({
        firstName,
        lastName,
        cityName,
        postalCode,
        address,
        phoneNumber,
        status,
      })

      expect(await screen.findByText('Profil')).toBeTruthy()
    })

    it('should navigate to stepper on press "Confirmer"', async () => {
      prepareDataAndRender({
        firstName,
        lastName,
        cityName,
        postalCode,
        address,
        phoneNumber,
        status,
      })

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
      resetStoresSpy.mockClear()
      prepareDataAndRender({
        firstName,
        lastName,
        cityName,
        postalCode,
        address,
        phoneNumber,
        status,
      })

      await user.press(screen.getByText('Confirmer'))

      await waitFor(() => expect(resetStoresSpy).toHaveBeenCalledTimes(1))
      resetStoresSpy.mockRestore()
    })

    it('should call refetchUser after submission succeeds', async () => {
      prepareDataAndRender({
        firstName,
        lastName,
        cityName,
        postalCode,
        address,
        phoneNumber,
        status,
      })

      await user.press(screen.getByText('Confirmer'))

      await waitFor(() => expect(mockRefetchUser).toHaveBeenCalledTimes(1))
    })

    it('should navigate to error screen if posting profile fails', async () => {
      mockUseMutationError({ content: {}, name: 'ApiError', statusCode: 400, message: 'erreur' })
      useRoute.mockReturnValueOnce({ params: { type: ProfileTypes.BOOKING_FREE_OFFER_15_16 } })
      prepareDataAndRender({
        firstName,
        lastName,
        cityName,
        postalCode,
        address,
        phoneNumber,
        status,
      })

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

    describe('booking free offer 15-16 years', () => {
      beforeEach(() => {
        useRoute.mockReturnValue({
          params: {
            type: ProfileTypes.BOOKING_FREE_OFFER_15_16,
            origin: ProfileOrigin.OFFER,
            freeOfferId: offerId,
          },
        })
        mockUseAuthContext.mockReturnValue({
          refetchUser: mockRefetchUser,
          user: eligibleUserV2,
        })
      })

      it('should display correct infos in booking free offer 15-16 years', async () => {
        prepareDataAndRender({
          firstName,
          lastName,
          cityName,
          postalCode,
          address,
          status,
        })

        expect(await screen.findByText('Informations personnelles')).toBeOnTheScreen()
      })

      it('should navigate to Offer screen if booking free offer and offer ID exists', async () => {
        prepareDataAndRender({
          firstName,
          lastName,
          cityName,
          postalCode,
          address,
          status,
        })

        await user.press(screen.getByText('Confirmer'))

        await waitFor(() => {
          expect(reset).toHaveBeenCalledWith({
            routes: [{ name: 'Offer', params: { id: offerId } }],
          })
        })
      })

      it('should not have phone number in recap', async () => {
        prepareDataAndRender({
          firstName,
          lastName,
          cityName,
          postalCode,
          address,
          status,
        })

        expect(screen.queryByText('Numéro de téléphone')).not.toBeOnTheScreen()
      })

      it('should navigate to error screen when booking free offer but no offer ID is stored', async () => {
        useRoute.mockReturnValueOnce({
          params: {
            type: ProfileTypes.BOOKING_FREE_OFFER_15_16,
            origin: ProfileOrigin.OFFER,
          },
        })
        prepareDataAndRender({
          firstName,
          lastName,
          cityName,
          postalCode,
          address,
          status,
        })

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
})

function prepareDataAndRender({
  firstName,
  lastName,
  cityName,
  postalCode,
  address,
  phoneNumber,
  status,
}: {
  firstName: string
  lastName: string
  cityName: string
  postalCode: string
  address: string
  phoneNumber?: string
  status: ActivityIdEnum
}) {
  const { setName } = nameActions
  const { setCity } = cityActions
  const { setAddress } = addressActions
  const { setStatus } = statusActions
  const { setPhoneNumber } = phoneNumberActions

  setName({ firstName, lastName })
  setCity({ name: cityName, postalCode, code: 'PARIS_CODE', departementCode: '75' })
  setAddress(address)
  setStatus(status)
  if (phoneNumber) setPhoneNumber({ phoneNumber, countryId: 'FR' })

  render(reactQueryProviderHOC(<ActivationProfileRecap />))
}
