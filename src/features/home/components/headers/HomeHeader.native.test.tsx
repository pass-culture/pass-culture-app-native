import { NavigationContainer } from '@react-navigation/native'
import mockdate from 'mockdate'
import React from 'react'

import {
  BannerName,
  BannerResponse,
  SubscriptionStatus,
  UserProfileResponse,
  YoungStatusType,
} from 'api/gen'
import * as Auth from 'features/auth/context/AuthContext'
import { nonBeneficiaryUser } from 'fixtures/user'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { Credit, useAvailableCredit } from 'shared/user/useAvailableCredit'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, render, screen, waitFor } from 'tests/utils'

import { HomeHeader } from './HomeHeader'

jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(false)

jest.unmock('@react-navigation/native')

const mockUseAuthContext = jest.spyOn(Auth, 'useAuthContext')

jest.mock('libs/jwt/jwt')
jest.mock('shared/user/useAvailableCredit')
const mockUseAvailableCredit = useAvailableCredit as jest.MockedFunction<typeof useAvailableCredit>

mockdate.set(new Date('2022-12-01T00:00:00Z'))

const mockedUser = {
  ...nonBeneficiaryUser,
  status: {
    statusType: YoungStatusType.eligible,
    subscriptionStatus: SubscriptionStatus.has_to_complete_subscription,
  },
}

mockUseAuthContext.mockReturnValue({
  isLoggedIn: true,
  isUserLoading: false,
  setIsLoggedIn: jest.fn(),
  refetchUser: jest.fn(),
})

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

describe('HomeHeader', () => {
  it.each`
    usertype                     | user                                                                              | isLoggedIn | credit                                | subtitle
    ${'ex beneficiary'}          | ${{ ...mockedUser, isBeneficiary: true, isEligibleForBeneficiaryUpgrade: false }} | ${true}    | ${{ amount: 0, isExpired: true }}     | ${'Ton crédit est expiré'}
    ${'beneficiary'}             | ${{ ...mockedUser, isBeneficiary: true, isEligibleForBeneficiaryUpgrade: false }} | ${true}    | ${{ amount: 5600, isExpired: false }} | ${'Tu as 56 € sur ton pass'}
    ${'eligible ex beneficiary'} | ${{ ...mockedUser, isBeneficiary: true, isEligibleForBeneficiaryUpgrade: true }}  | ${true}    | ${{ amount: 5, isExpired: true }}     | ${'Toute la culture à portée de main'}
    ${'general'}                 | ${{ ...mockedUser, isBeneficiary: false }}                                        | ${true}    | ${{ amount: 0, isExpired: false }}    | ${'Toute la culture à portée de main'}
    ${'not logged in'}           | ${undefined}                                                                      | ${false}   | ${{ amount: 0, isExpired: false }}    | ${'Toute la culture à portée de main'}
  `(
    '$usertype users should see subtitle: $subtitle',
    async ({
      user,
      isLoggedIn,
      credit,
      subtitle,
    }: {
      user: UserProfileResponse
      isLoggedIn: boolean
      credit: Credit
      subtitle: string
    }) => {
      const useAuthContextResultMock = {
        isLoggedIn: isLoggedIn,
        user,
        isUserLoading: false,
        setIsLoggedIn: jest.fn(),
        refetchUser: jest.fn(),
      }
      mockUseAuthContext.mockReturnValueOnce(useAuthContextResultMock)

      mockUseAvailableCredit.mockReturnValueOnce(credit)

      mockGeolocBannerFromBackend()

      renderHomeHeader()
      await act(async () => {})

      expect(await screen.findByText(subtitle)).toBeOnTheScreen()
    }
  )

  it('should show LocationWidget when isDesktopViewport is false', async () => {
    mockGeolocBannerFromBackend()

    renderHomeHeader()

    await screen.findByTestId('Ouvrir la modale de localisation depuis le widget')

    expect(screen.getByText('Me localiser')).toBeTruthy()
  })

  it('should not show LocationWidget isDesktopViewport is true', async () => {
    mockGeolocBannerFromBackend()

    renderHomeHeader(true)

    await waitFor(() => {
      expect(
        screen.queryByTestId('Ouvrir la modale de localisation depuis le widget')
      ).not.toBeOnTheScreen()
    })
  })

  it('should show LocationTitleWidget isDesktopViewport is true', async () => {
    mockGeolocBannerFromBackend()

    renderHomeHeader(true)

    expect(
      await screen.findByTestId('Ouvrir la modale de localisation depuis le titre')
    ).toBeTruthy()
  })

  it('should not show LocationTitleWidget isDesktopViewport is false', async () => {
    mockGeolocBannerFromBackend()

    renderHomeHeader(false)

    await waitFor(() => {
      expect(
        screen.queryByTestId('Ouvrir la modale de localisation depuis le titre')
      ).not.toBeOnTheScreen()
    })
  })
})

function renderHomeHeader(isDesktopViewport?: boolean) {
  return render(
    reactQueryProviderHOC(
      <NavigationContainer>
        <HomeHeader />
      </NavigationContainer>
    ),
    {
      theme: { isDesktopViewport: isDesktopViewport ?? false },
    }
  )
}

function mockGeolocBannerFromBackend() {
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
}
