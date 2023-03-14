import mockdate from 'mockdate'
import { rest } from 'msw'
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
import { env } from 'libs/environment'
import { GeolocPermissionState, useGeolocation } from 'libs/geolocation'
import { Credit, useAvailableCredit } from 'shared/user/useAvailableCredit'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { render, screen, waitFor } from 'tests/utils'

import { HomeHeader } from './HomeHeader'

const mockUseAuthContext = jest.spyOn(Auth, 'useAuthContext')

jest.mock('shared/user/useAvailableCredit')
const mockUseAvailableCredit = useAvailableCredit as jest.MockedFunction<typeof useAvailableCredit>

jest.mock('libs/geolocation')
const mockUseGeolocation = useGeolocation as jest.Mock
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
      mockUseAuthContext.mockReturnValueOnce({
        isLoggedIn: isLoggedIn,
        user,
        isUserLoading: false,
        setIsLoggedIn: jest.fn(),
        refetchUser: jest.fn(),
      })
      mockUseAvailableCredit.mockReturnValueOnce(credit)

      renderHomeHeader()

      expect(await screen.findByText(subtitle)).toBeTruthy()
    }
  )

  it('should not display geolocation banner when geolocation is granted', async () => {
    renderHomeHeader()

    await waitFor(() => {
      expect(screen.queryByText('Géolocalise-toi')).toBeNull()
    })
  })

  it('should display geolocation banner when geolocation is denied', async () => {
    mockUseGeolocation.mockReturnValueOnce({ permissionState: GeolocPermissionState.DENIED })

    renderHomeHeader()

    expect(await screen.findByText('Géolocalise-toi')).toBeTruthy()
  })

  it('should display geolocation banner when geolocation is never ask again', async () => {
    mockUseGeolocation.mockReturnValueOnce({
      permissionState: GeolocPermissionState.NEVER_ASK_AGAIN,
    })
    renderHomeHeader()

    expect(await screen.findByText('Géolocalise-toi')).toBeTruthy()
  })

  it('should have CheatMenu button when FEATURE_FLIPPING_ONLY_VISIBLE_ON_TESTING=true', async () => {
    env.FEATURE_FLIPPING_ONLY_VISIBLE_ON_TESTING = true
    renderHomeHeader()

    expect(await screen.findByText('CheatMenu')).toBeTruthy()
  })

  it('should NOT have CheatMenu button when NOT FEATURE_FLIPPING_ONLY_VISIBLE_ON_TESTING=false', async () => {
    env.FEATURE_FLIPPING_ONLY_VISIBLE_ON_TESTING = false
    renderHomeHeader()

    await waitFor(() => {
      expect(screen.queryByText('CheatMenu')).toBeNull()
    })
  })

  it('should display SignupBanner when user is not logged in', async () => {
    mockUseAuthContext.mockReturnValueOnce({
      isLoggedIn: false,
      isUserLoading: false,
      setIsLoggedIn: jest.fn(),
      refetchUser: jest.fn(),
    })

    renderHomeHeader()

    expect(await screen.findByText('Débloque ton crédit')).toBeTruthy()
  })

  it('should display activation banner when banner api call return activation banner', async () => {
    server.use(
      rest.get<BannerResponse>(env.API_BASE_URL + '/native/v1/banner', (_req, res, ctx) =>
        res(
          ctx.status(200),
          ctx.json({
            banner: {
              name: BannerName.activation_banner,
              text: 'à dépenser sur l’application',
              title: 'Débloque tes 1000\u00a0€',
            },
          })
        )
      )
    )

    renderHomeHeader()

    expect(await screen.findByText('Débloque tes 1000\u00a0€')).toBeTruthy()
    expect(screen.getByText('à dépenser sur l’application')).toBeTruthy()
  })
})

function renderHomeHeader() {
  return render(<HomeHeader />, {
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })
}
