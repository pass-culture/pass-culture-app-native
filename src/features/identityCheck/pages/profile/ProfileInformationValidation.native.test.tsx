import React from 'react'

import { reset, navigate, useRoute } from '__mocks__/@react-navigation/native'
import { ApiError } from 'api/ApiError'
import { ActivityIdEnum } from 'api/gen'
import { initialSubscriptionState as mockState } from 'features/identityCheck/context/reducer'
import { ProfileTypes } from 'features/identityCheck/pages/profile/enums'
import { useAddress } from 'features/identityCheck/pages/profile/store/addressStore'
import { useCity } from 'features/identityCheck/pages/profile/store/cityStore'
import { useName } from 'features/identityCheck/pages/profile/store/nameStore'
import * as resetStores from 'features/identityCheck/pages/profile/store/resetProfileStores'
import { useStatus } from 'features/identityCheck/pages/profile/store/statusStore'
import * as usePostProfileMutation from 'features/identityCheck/queries/usePostProfileMutation'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent, waitFor } from 'tests/utils'

import { ProfileInformationValidation } from './ProfileInformationValidation'

const usePostProfileMutationSpy = jest.spyOn(usePostProfileMutation, 'usePostProfileMutation')

const mockUseMutationError = (error?: ApiError) => {
  // @ts-ignore we don't use the other properties of UseMutationResult (such as failureCount)
  usePostProfileMutationSpy.mockImplementation(({ onError }) => ({
    // @ts-ignore it's a mock
    mutateAsync: jest.fn(() => onError(error)),
  }))
}

const mockOfferId: number | null = 123456
jest.mock('features/offer/store/freeOfferIdStore', () => ({
  useFreeOfferId: () => mockOfferId,
}))

jest.mock('features/identityCheck/pages/profile/store/nameStore')
const mockedUseName = useName as jest.Mock
const mockName = { firstName: 'Jean', lastName: 'Dupont' }

jest.mock('features/identityCheck/pages/profile/store/cityStore')
const mockedUseCity = useCity as jest.Mock
const mockCity = { name: 'Paris', postalCode: '75011', cityCode: '12345' }

jest.mock('features/identityCheck/pages/profile/store/addressStore')
const mockedUseAddress = useAddress as jest.Mock
const mockAddress = '1 rue du Test'

jest.mock('features/identityCheck/pages/profile/store/statusStore')
const mockedUseStatus = useStatus as jest.Mock
const mockStatus = ActivityIdEnum.STUDENT

jest.mock('features/identityCheck/context/SubscriptionContextProvider', () => ({
  useSubscriptionContext: jest.fn(() => ({
    dispatch: jest.fn(),
    ...mockState,
    profile: {
      name: mockName,
      city: mockCity,
      address: mockAddress,
      status: mockStatus,
    },
  })),
}))

const mockRefetchUser = jest.fn()
jest.mock('features/auth/context/AuthContext', () => ({
  useAuthContext: jest.fn(() => ({ refetchUser: mockRefetchUser })),
}))

const user = userEvent.setup()
jest.useFakeTimers()

useRoute.mockReturnValue({
  params: {
    type: ProfileTypes.BOOKING_FREE_OFFER_15_16,
  },
})

describe('ProfileInformationValidation', () => {
  beforeEach(() => {
    setFeatureFlags()
    mockedUseName.mockReturnValue(mockName)
    mockedUseCity.mockReturnValue(mockCity)
    mockedUseAddress.mockReturnValue(mockAddress)
    mockedUseStatus.mockReturnValue(mockStatus)
  })

  it('should render correctly', async () => {
    renderProfileInformationValidation()

    await screen.findByText('Informations personnelles')

    expect(screen).toMatchSnapshot()
  })

  it('should display correct infos in identity check', async () => {
    useRoute.mockReturnValueOnce({
      params: { type: ProfileTypes.IDENTITY_CHECK },
    })
    renderProfileInformationValidation()

    expect(await screen.findByText('Profil')).toBeTruthy()
  })

  it('should display correct infos in booking free offer 15/16 years', async () => {
    renderProfileInformationValidation()

    expect(await screen.findByText('Informations personnelles')).toBeTruthy()
  })

  it('should navigate to Offer when press "Continuer"', async () => {
    setFeatureFlags([RemoteStoreFeatureFlags.ENABLE_BOOKING_FREE_OFFER_15_16])

    renderProfileInformationValidation()

    await user.press(screen.getByText('Continuer'))

    await waitFor(() => {
      expect(reset).toHaveBeenCalledWith({
        routes: [{ name: 'Offer', params: { id: mockOfferId } }],
      })
    })
  })

  it('should navigate to SetName when press "Modifier mes informations"', async () => {
    setFeatureFlags([RemoteStoreFeatureFlags.ENABLE_BOOKING_FREE_OFFER_15_16])

    renderProfileInformationValidation()

    await user.press(screen.getByText('Modifier mes informations'))

    expect(navigate).toHaveBeenCalledWith('SetName', {
      type: ProfileTypes.BOOKING_FREE_OFFER_15_16,
    })
  })

  it('should reset profile stores after submission succeeds', async () => {
    const resetStoresSpy = jest.spyOn(resetStores, 'resetProfileStores')
    renderProfileInformationValidation()

    await user.press(screen.getByText('Continuer'))

    await waitFor(() => {
      expect(resetStoresSpy).toHaveBeenCalledTimes(1)
    })
  })

  it('should call refetchUser after submission succeeds', async () => {
    renderProfileInformationValidation()

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
    renderProfileInformationValidation()

    await user.press(screen.getByText('Continuer'))

    expect(reset).toHaveBeenCalledWith({
      routes: [{ name: 'SetProfileBookingError', params: { offerId: mockOfferId } }],
    })
  })
})

const renderProfileInformationValidation = () => {
  return render(reactQueryProviderHOC(<ProfileInformationValidation />))
}
