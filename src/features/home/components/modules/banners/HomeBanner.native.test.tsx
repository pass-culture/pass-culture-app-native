import React from 'react'

import { ApiError } from 'api/ApiError'
import { BannerName, BannerResponse, SubscriptionStepperResponseV2 } from 'api/gen'
import { HomeBanner } from 'features/home/components/modules/banners/HomeBanner'
import { subscriptionStepperFixture } from 'features/identityCheck/fixtures/subscriptionStepperFixture'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { ILocationContext, useLocation } from 'libs/location/location'
import { LocationMode } from 'libs/location/types'
import { eventMonitoring } from 'libs/monitoring/services'
import { useGetDepositAmountsByAge } from 'shared/user/useGetDepositAmountsByAge'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, render, screen, waitFor } from 'tests/utils'

jest.mock('libs/network/NetInfoWrapper')
jest.mock('libs/firebase/analytics/analytics')
jest.mock('libs/jwt/jwt')
jest.mock('features/auth/context/AuthContext', () => ({
  useAuthContext: jest.fn(() => ({ isLoggedIn: true })),
}))

jest.mock('libs/location/location')
const mockUseGeolocation = jest.mocked(useLocation)

jest.mock('shared/user/useGetDepositAmountsByAge')
const mockDepositAmounts = jest.mocked(useGetDepositAmountsByAge)

jest.mock('@react-native-firebase/firestore')

jest.useFakeTimers()

describe('<HomeBanner/>', () => {
  beforeEach(() => {
    setFeatureFlags()
    mockDepositAmounts.mockReturnValue(undefined)
    mockUseGeolocation.mockReturnValue({
      selectedLocationMode: LocationMode.EVERYWHERE,
    } as ILocationContext)
  })

  describe('when feature flag showRemoteGenericBanner is enable', () => {
    beforeEach(() => {
      setFeatureFlags([
        {
          featureFlag: RemoteStoreFeatureFlags.SHOW_REMOTE_GENERIC_BANNER,
          options: {
            title: 'title 1',
            subtitleMobile: 'subtitleMobile 1',
            subtitleWeb: 'subtitleWeb 1',
            redirectionUrl: 'https://www.test.fr',
            redirectionType: 'store',
          },
        },
      ])
    })

    it('should display force update banner', async () => {
      mockSubscriptionStepper()
      mockBannerFromBackend({
        banner: {
          name: BannerName.retry_identity_check_banner,
          title: 'Retente ubble',
          text: 'pour débloquer ton crédit',
        },
      })
      renderHomeBanner({})
      const remoteBanner = await screen.findByText('title 1')

      expect(remoteBanner).toBeOnTheScreen()
    })
  })

  describe('when feature flag showTechnicalProblemBanner is enable', () => {
    beforeEach(() => {
      setFeatureFlags([
        {
          featureFlag: RemoteStoreFeatureFlags.SHOW_TECHNICAL_PROBLEM_BANNER,
          options: {
            severity: 'error',
            label: 'Problème technique',
            message: 'Nous rencontrons des difficultés',
          },
        },
      ])
    })

    it('should display technical problem banner', async () => {
      renderHomeBanner({})
      const technicalBanner = await screen.findByText('Problème technique')

      expect(technicalBanner).toBeOnTheScreen()
      expect(screen.getByText('Nous rencontrons des difficultés')).toBeOnTheScreen()
    })
  })

  describe('user is not logged in', () => {
    it('should display SignupBanner when user is not logged in', async () => {
      mockSubscriptionStepper()
      mockBannerFromBackend({
        banner: {
          name: BannerName.geolocation_banner,
          title: 'Géolocalise-toi',
          text: 'Pour trouver des offres autour de toi.',
        },
      })

      renderHomeBanner({ isLoggedIn: false })
      await act(async () => {})

      expect(screen.getByText('Débloque ton crédit')).toBeOnTheScreen()
    })
  })

  describe('user is logged in', () => {
    it('should display activation banner with Unlock icon when banner api call return activation banner', async () => {
      mockSubscriptionStepper()
      mockBannerFromBackend({
        banner: {
          name: BannerName.activation_banner,
          text: 'à dépenser sur l’application',
          title: 'Débloque tes 1000\u00a0€',
        },
      })

      renderHomeBanner({})
      await screen.findByText('Débloque tes 1000\u00a0€')

      expect(screen.getByTestId('Unlock')).toBeOnTheScreen()
    })

    it('should display activation banner with ArrowAgain icon when banner api call return retry_identity_check_banner', async () => {
      mockSubscriptionStepper()
      mockBannerFromBackend({
        banner: {
          name: BannerName.retry_identity_check_banner,
          title: 'Retente ubble',
          text: 'pour débloquer ton crédit',
        },
      })

      renderHomeBanner({})
      await screen.findByText('Retente ubble')

      expect(screen.getByTestId('ArrowAgain')).toBeOnTheScreen()
    })

    it('should display activation banner with BirthdayCake icon when banner api call return transition_17_18_banner', async () => {
      mockSubscriptionStepper()
      mockBannerFromBackend({
        banner: {
          name: BannerName.transition_17_18_banner,
          title: 'Débloque tes 600\u00a0€',
          text: 'Confirme tes informations',
        },
      })

      renderHomeBanner({})
      await screen.findByText('Débloque tes 600\u00a0€')

      expect(screen.getByTestId('BirthdayCake')).toBeOnTheScreen()
    })

    it('should notify errors when query fails', async () => {
      mockSubscriptionStepper()
      mockServer.getApi<BannerResponse>('/v1/banner', {
        responseOptions: {
          statusCode: 'network-error',
        },
      })

      renderHomeBanner({})

      await waitFor(() =>
        expect(eventMonitoring.captureException).toHaveBeenCalledWith(expect.any(ApiError))
      )
    })
  })
})

function renderHomeBanner({ isLoggedIn = true }: { isLoggedIn?: boolean }) {
  return render(<HomeBanner isLoggedIn={isLoggedIn} />, {
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })
}
const mockBannerFromBackend = (banner: BannerResponse) => {
  mockServer.getApi<BannerResponse>('/v1/banner', {
    responseOptions: {
      data: banner,
    },
    requestOptions: { persist: true },
  })
}

const mockSubscriptionStepper = () => {
  mockServer.getApi<SubscriptionStepperResponseV2>(
    '/v2/subscription/stepper',
    subscriptionStepperFixture
  )
}
