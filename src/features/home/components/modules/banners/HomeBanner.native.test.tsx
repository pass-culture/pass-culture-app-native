import React from 'react'

import { BannerName, BannerResponse } from 'api/gen'
import { HomeBanner } from 'features/home/components/modules/banners/HomeBanner'
import * as useFeatureFlag from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { mockAuthContextWithoutUser } from 'tests/AuthContextUtils'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'

jest.mock('libs/jwt/jwt')
jest.mock('features/auth/context/AuthContext', () => ({
  useAuthContext: jest.fn(() => ({ isLoggedIn: true })),
}))

const useFeatureFlagSpy = jest.spyOn(useFeatureFlag, 'useFeatureFlag')

describe('<HomeBanner/>', () => {
  describe('When wipAppV2SystemBlock feature flag deactivated', () => {
    beforeAll(() => {
      useFeatureFlagSpy.mockReturnValue(false)
    })

    it('should display SignupBanner when user is not logged in', async () => {
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
        mockBannerFromBackend({
          banner: {
            name: BannerName.activation_banner,
            text: 'à dépenser sur l’application',
            title: 'Débloque tes 1000\u00a0€',
          },
        })

        renderHomeBanner({})

        expect(await screen.findByText('Débloque tes 1000\u00a0€')).toBeOnTheScreen()
        expect(screen.getByText('à dépenser sur l’application')).toBeOnTheScreen()
        expect(screen.getByTestId('BicolorUnlock')).toBeOnTheScreen()
      })

      it('should display activation banner with ArrowAgain icon when banner api call return retry_identity_check_banner', async () => {
        mockBannerFromBackend({
          banner: {
            name: BannerName.retry_identity_check_banner,
            title: 'Retente ubble',
            text: 'pour débloquer ton crédit',
          },
        })

        renderHomeBanner({})

        expect(await screen.findByText('Retente ubble')).toBeOnTheScreen()
        expect(screen.getByText('pour débloquer ton crédit')).toBeOnTheScreen()
        expect(screen.getByTestId('ArrowAgain')).toBeOnTheScreen()
      })

      it('should display activation banner with BirthdayCake icon when banner api call return transition_17_18_banner', async () => {
        mockBannerFromBackend({
          banner: {
            name: BannerName.transition_17_18_banner,
            title: 'Débloque tes 600\u00a0€',
            text: 'Confirme tes informations',
          },
        }),
          renderHomeBanner({})

        expect(await screen.findByText('Débloque tes 600\u00a0€')).toBeOnTheScreen()
        expect(screen.getByText('Confirme tes informations')).toBeOnTheScreen()
        expect(screen.getByTestId('BirthdayCake')).toBeOnTheScreen()
      })
    })
  })

  describe('When wipAppV2SystemBlock feature flag activated', () => {
    beforeAll(() => {
      useFeatureFlagSpy.mockReturnValue(true)
    })

    it('should display SignupBanner when user is not logged in', async () => {
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
        mockBannerFromBackend({
          banner: {
            name: BannerName.activation_banner,
            text: 'à dépenser sur l’application',
            title: 'Débloque tes 1000\u00a0€',
          },
        })

        renderHomeBanner({})

        expect(await screen.findByText('Débloque tes 1000\u00a0€')).toBeOnTheScreen()
        expect(screen.getByText('à dépenser sur l’application')).toBeOnTheScreen()
        expect(screen.getByTestId('BicolorUnlock')).toBeOnTheScreen()
      })

      it('should display activation banner with ArrowAgain icon when banner api call return retry_identity_check_banner', async () => {
        mockBannerFromBackend({
          banner: {
            name: BannerName.retry_identity_check_banner,
            title: 'Retente ubble',
            text: 'pour débloquer ton crédit',
          },
        })

        renderHomeBanner({})

        expect(await screen.findByText('Retente ubble')).toBeOnTheScreen()
        expect(screen.getByText('pour débloquer ton crédit')).toBeOnTheScreen()
        expect(screen.getByTestId('ArrowAgain')).toBeOnTheScreen()
      })

      it('should display activation banner with BirthdayCake icon when banner api call return transition_17_18_banner', async () => {
        mockBannerFromBackend({
          banner: {
            name: BannerName.transition_17_18_banner,
            title: 'Débloque tes 600\u00a0€',
            text: 'Confirme tes informations',
          },
        }),
          renderHomeBanner({})

        expect(await screen.findByText('Débloque tes 600\u00a0€')).toBeOnTheScreen()
        expect(screen.getByText('Confirme tes informations')).toBeOnTheScreen()
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
