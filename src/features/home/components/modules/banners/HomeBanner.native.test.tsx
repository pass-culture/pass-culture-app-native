import React from 'react'

import { BannerName, BannerResponse, SubscriptionStepperResponseV2 } from 'api/gen'
import { HomeBanner } from 'features/home/components/modules/banners/HomeBanner'
import { subscriptionStepperFixture } from 'features/identityCheck/fixtures/subscriptionStepperFixture'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/__tests__/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { ILocationContext, useLocation } from 'libs/location'
import { LocationMode } from 'libs/location/types'
import { useGetDepositAmountsByAge } from 'shared/user/useGetDepositAmountsByAge'
import { mockAuthContextWithoutUser } from 'tests/AuthContextUtils'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, render, screen } from 'tests/utils'

jest.mock('libs/network/NetInfoWrapper')

jest.mock('libs/jwt/jwt')
jest.mock('features/auth/context/AuthContext', () => ({
  useAuthContext: jest.fn(() => ({ isLoggedIn: true })),
}))

jest.mock('libs/location')
const mockUseGeolocation = jest.mocked(useLocation)

jest.mock('shared/user/useGetDepositAmountsByAge')
const mockDepositAmounts = jest.mocked(useGetDepositAmountsByAge)

describe('<HomeBanner/>', () => {
  describe('When wipAppV2SystemBlock feature flag deactivated', () => {
    beforeEach(() => {
      mockDepositAmounts.mockReturnValue(undefined)
      mockUseGeolocation.mockReturnValue({
        selectedLocationMode: LocationMode.EVERYWHERE,
      } as ILocationContext)
    })

    beforeAll(() => {
      setFeatureFlags()
    })

    it('should display SignupBanner when user is not logged in', async () => {
      mockSubscriptionStepper()
      mockBannerFromBackend({})
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

    describe('user is logged in', () => {
      it('should display activation banner with BicolorUnlock icon when banner api call return activation banner', async () => {
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

        expect(screen.getByTestId('BicolorUnlock')).toBeOnTheScreen()
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
    })
  })

  describe('When wipAppV2SystemBlock feature flag activated', () => {
    beforeAll(() => {
      setFeatureFlags([RemoteStoreFeatureFlags.WIP_APP_V2_SYSTEM_BLOCK])
    })

    it('should display SignupBanner when user is not logged in', async () => {
      mockSubscriptionStepper()
      mockServer.getApi<BannerResponse>('/v1/banner?isGeolocated=true', {
        responseOptions: {
          data: {},
        },
        requestOptions: { persist: true },
      })
      mockServer.getApi<BannerResponse>('/v1/banner?isGeolocated=false', {
        responseOptions: {
          data: {
            banner: {
              name: BannerName.geolocation_banner,
              title: 'Géolocalise-toi',
              text: 'Pour trouver des offres autour de toi.',
            },
          },
        },
        requestOptions: { persist: true },
      })
      mockAuthContextWithoutUser()

      renderHomeBanner({ isLoggedIn: false })

      expect(await screen.findByText('Débloque ton crédit')).toBeOnTheScreen()
    })

    describe('user is logged in', () => {
      it('should display activation banner with BicolorUnlock icon when banner api call return activation banner', async () => {
        mockSubscriptionStepper()
        mockBannerFromBackend({
          banner: {
            name: BannerName.activation_banner,
            text: 'à dépenser sur l’application',
            title: 'Débloque tes 1000\u00a0€',
          },
        })

        renderHomeBanner({ isLoggedIn: true })
        await screen.findByText('Débloque tes 1000\u00a0€')

        expect(screen.getByTestId('BicolorUnlock')).toBeOnTheScreen()
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

        renderHomeBanner({ isLoggedIn: true })
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

        renderHomeBanner({ isLoggedIn: true })
        await screen.findByText('Débloque tes 600\u00a0€')

        expect(screen.getByTestId('BirthdayCake')).toBeOnTheScreen()
      })
    })
  })
})

function renderHomeBanner({
  hasGeolocPosition = true,
  isLoggedIn = true,
}: {
  hasGeolocPosition?: boolean
  isLoggedIn?: boolean
}) {
  return render(<HomeBanner hasGeolocPosition={hasGeolocPosition} isLoggedIn={isLoggedIn} />, {
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
