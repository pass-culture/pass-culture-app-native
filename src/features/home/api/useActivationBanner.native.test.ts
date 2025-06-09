import { UseQueryResult } from '@tanstack/react-query'

import { BannerName, CurrencyEnum, SubscriptionStep, SubscriptionStepperResponseV2 } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { useGetStepperInfoQuery } from 'features/identityCheck/queries/useGetStepperInfoQuery'
import { beneficiaryUser, nonBeneficiaryUser } from 'fixtures/user'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { GeolocPermissionState } from 'libs/location'
import { LocationMode } from 'libs/location/types'
import { useGetDepositAmountsByAge } from 'shared/user/useGetDepositAmountsByAge'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook, act } from 'tests/utils'

import { useActivationBanner } from './useActivationBanner'

const mockBannerName = BannerName.activation_banner
jest.mock('features/home/queries/useBannerQuery', () => ({
  useBannerQuery: jest.fn(() => ({
    data: {
      banner: {
        title: 'API - Débloque tes 150\u00a0€',
        text: 'API - Bénéficie de ton crédit maintenant !',
        name: mockBannerName,
      },
    },
  })),
}))

jest.mock('libs/jwt/jwt')
jest.mock('features/auth/context/AuthContext')
const mockUseAuthContext = jest.mocked(useAuthContext)
mockUseAuthContext.mockReturnValue({
  isLoggedIn: true,
  setIsLoggedIn: jest.fn(),
  refetchUser: jest.fn(),
  isUserLoading: false,
  user: {
    ...nonBeneficiaryUser,
    isEligibleForBeneficiaryUpgrade: false,
    currency: CurrencyEnum.EUR,
  },
})

jest.mock('features/identityCheck/queries/useGetStepperInfoQuery')
const mockUseGetStepperInfo = (
  useGetStepperInfoQuery as jest.Mock<
    Partial<UseQueryResult<Partial<SubscriptionStepperResponseV2>, unknown>>
  >
).mockReturnValue({
  data: { nextSubscriptionStep: null },
})

jest.mock('shared/user/useGetDepositAmountsByAge')
const mockDepositAmounts = jest.mocked(useGetDepositAmountsByAge)
mockDepositAmounts.mockReturnValue('150\u00a0€')

const defaultUseLocation = {
  selectedLocationMode: LocationMode.EVERYWHERE,
  permissionState: GeolocPermissionState.GRANTED,
}
const mockUseLocation = jest.fn(() => defaultUseLocation)
jest.mock('libs/location/LocationWrapper', () => ({
  useLocation: () => mockUseLocation(),
}))

describe('useActivationBanner', () => {
  describe('with feature flag enable', () => {
    beforeEach(() => {
      setFeatureFlags([RemoteStoreFeatureFlags.ENABLE_PACIFIC_FRANC_CURRENCY])
    })

    it('nextSubscriptionStepEnable', async () => {
      mockUseGetStepperInfo.mockReturnValueOnce({
        data: { nextSubscriptionStep: SubscriptionStep['email-validation'] },
      })
      const { result } = renderUseActivationBanner()

      await act(async () => {})

      expect(result.current.banner).toEqual({
        title: 'Débloque tes 150\u00a0€',
        text: 'API - Bénéficie de ton crédit maintenant !',
        name: BannerName.activation_banner,
      })
    })

    it('isEligibleForBeneficiaryUpgrade', async () => {
      mockUseAuthContext.mockReturnValueOnce({
        isLoggedIn: true,
        setIsLoggedIn: jest.fn(),
        refetchUser: jest.fn(),
        isUserLoading: false,
        user: {
          ...beneficiaryUser,
          isEligibleForBeneficiaryUpgrade: true,
          currency: CurrencyEnum.EUR,
        },
      })

      const { result } = renderUseActivationBanner()

      await act(async () => {})

      expect(result.current.banner).toEqual({
        title: 'Débloque tes 150\u00a0€',
        text: 'API - Bénéficie de ton crédit maintenant !',
        name: BannerName.activation_banner,
      })
    })

    it('isUserLocated', async () => {
      mockUseLocation.mockReturnValueOnce({
        ...defaultUseLocation,
        selectedLocationMode: LocationMode.AROUND_ME,
      })
      const { result } = renderUseActivationBanner()

      await act(async () => {})

      expect(result.current.banner).toEqual({
        title: 'Débloque tes 150\u00a0€',
        text: 'API - Bénéficie de ton crédit maintenant !',
        name: BannerName.activation_banner,
      })
    })

    it('isUserRegisteredInPacificFrancRegion', async () => {
      mockUseAuthContext.mockReturnValueOnce({
        isLoggedIn: true,
        setIsLoggedIn: jest.fn(),
        refetchUser: jest.fn(),
        isUserLoading: false,
        user: {
          ...beneficiaryUser,
          isEligibleForBeneficiaryUpgrade: false,
          currency: CurrencyEnum.XPF,
        },
      })
      const { result } = renderUseActivationBanner()

      await act(async () => {})

      expect(result.current.banner).toEqual({
        title: 'Débloque tes 150\u00a0€',
        text: 'API - Bénéficie de ton crédit maintenant !',
        name: BannerName.activation_banner,
      })
    })

    it('should return banner title without amount', async () => {
      mockDepositAmounts.mockReturnValueOnce(undefined)
      mockUseLocation.mockReturnValueOnce({
        ...defaultUseLocation,
        selectedLocationMode: LocationMode.AROUND_ME,
      })
      const { result } = renderUseActivationBanner()

      await act(async () => {})

      expect(result.current.banner).toEqual({
        title: 'Débloque ton crédit',
        text: 'API - Bénéficie de ton crédit maintenant !',
        name: BannerName.activation_banner,
      })
    })
  })

  describe('with feature flag disable', () => {
    beforeEach(() => {
      setFeatureFlags()
    })

    it('default API infos', async () => {
      const { result } = renderUseActivationBanner()

      await act(async () => {})

      expect(result.current.banner).toEqual({
        title: 'API - Débloque tes 150\u00a0€',
        text: 'API - Bénéficie de ton crédit maintenant !',
        name: BannerName.activation_banner,
      })
    })
  })
})

const renderUseActivationBanner = () =>
  renderHook(() => useActivationBanner(), {
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })
