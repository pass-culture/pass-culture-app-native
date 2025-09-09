import { NavigationContainer } from '@react-navigation/native'
import mockdate from 'mockdate'
import React from 'react'

import { BannerName, BannerResponse, DepositType, EligibilityType } from 'api/gen'
import { beneficiaryUser, nonBeneficiaryUser } from 'fixtures/user'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { LocationLabel } from 'libs/location/types'
import { useAvailableCredit } from 'shared/user/useAvailableCredit'
import { mockAuthContextWithUser, mockAuthContextWithoutUser } from 'tests/AuthContextUtils'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, waitFor } from 'tests/utils'

import { HomeHeader } from './HomeHeader'

jest.unmock('@react-navigation/native')
jest.mock('libs/jwt/jwt')
jest.mock('features/auth/context/AuthContext')
jest.mock('libs/firebase/analytics/analytics')
jest.mock('shared/user/useAvailableCredit')

const mockUseAvailableCredit = useAvailableCredit as jest.MockedFunction<typeof useAvailableCredit>
mockdate.set(new Date('2022-12-01T00:00:00Z'))

describe('HomeHeader', () => {
  beforeEach(() => {
    setFeatureFlags()
  })

  it('ex beneficiary users should see subtitle: Ton crédit est expiré', async () => {
    mockAuthContextWithUser({
      ...beneficiaryUser,
      eligibility: EligibilityType['age-18'],
      isEligibleForBeneficiaryUpgrade: false,
    })

    const credit = { amount: 5, isExpired: true }
    mockUseAvailableCredit.mockReturnValueOnce(credit)
    mockGeolocBannerFromBackend()

    renderHomeHeader()

    expect(await screen.findByText('Ton crédit est expiré')).toBeOnTheScreen()
  })

  it('beneficiary users should see subtitle: Tu as 56 € sur ton pass', async () => {
    mockAuthContextWithUser({
      ...beneficiaryUser,
      eligibility: EligibilityType['age-18'],
      isEligibleForBeneficiaryUpgrade: false,
    })

    const credit = { amount: 5600, isExpired: false }
    mockUseAvailableCredit.mockReturnValueOnce(credit)
    mockGeolocBannerFromBackend()

    renderHomeHeader()

    expect(await screen.findByText('Tu as 56 € sur ton pass')).toBeOnTheScreen()
  })

  it('should display "Toute la culture à portée de main" when user is eligible to free offer', async () => {
    mockAuthContextWithUser({
      ...beneficiaryUser,
      eligibility: EligibilityType.free,
      isEligibleForBeneficiaryUpgrade: false,
    })

    const credit = { amount: 0, isExpired: false }
    mockUseAvailableCredit.mockReturnValueOnce(credit)
    mockGeolocBannerFromBackend()

    renderHomeHeader()

    expect(await screen.findByText('Bonjour Jean')).toBeOnTheScreen()
    expect(await screen.findByText('Toute la culture à portée de main')).toBeOnTheScreen()
  })

  it('should display "Toute la culture à portée de main" when user deposit type is GRANT_FREE', async () => {
    mockAuthContextWithUser({
      ...beneficiaryUser,
      eligibility: EligibilityType['age-17-18'],
      depositType: DepositType.GRANT_FREE,
      isEligibleForBeneficiaryUpgrade: false,
    })

    const credit = { amount: 0, isExpired: false }
    mockUseAvailableCredit.mockReturnValueOnce(credit)
    mockGeolocBannerFromBackend()

    renderHomeHeader()

    expect(await screen.findByText('Bonjour Jean')).toBeOnTheScreen()
    expect(await screen.findByText('Toute la culture à portée de main')).toBeOnTheScreen()
  })

  it('general users should see subtitle: Toute la culture à portée de main', async () => {
    mockAuthContextWithUser(nonBeneficiaryUser)

    const credit = { amount: 0, isExpired: false }
    mockUseAvailableCredit.mockReturnValueOnce(credit)
    mockGeolocBannerFromBackend()

    renderHomeHeader()

    expect(await screen.findByText('Toute la culture à portée de main')).toBeOnTheScreen()
  })

  it('not logged in users should see subtitle: Toute la culture à portée de main', async () => {
    mockAuthContextWithoutUser()

    const credit = { amount: 0, isExpired: false }
    mockUseAvailableCredit.mockReturnValueOnce(credit)
    mockGeolocBannerFromBackend()

    renderHomeHeader()

    expect(await screen.findByText('Toute la culture à portée de main')).toBeOnTheScreen()
  })

  it('should show LocationWidget when isDesktopViewport is false', async () => {
    mockGeolocBannerFromBackend()

    renderHomeHeader()

    await screen.findByTestId('Ouvrir la modale de localisation depuis le widget')

    expect(screen.getByText(LocationLabel.everywhereLabel)).toBeTruthy()
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
