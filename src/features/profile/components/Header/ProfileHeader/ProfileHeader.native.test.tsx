import mockdate from 'mockdate'
import React from 'react'

import {
  BannerName,
  BannerResponse,
  CurrencyEnum,
  SubscriptionStepperResponseV2,
  UserProfileResponse,
  YoungStatusType,
} from 'api/gen'
import { subscriptionStepperFixture } from 'features/identityCheck/fixtures/subscriptionStepperFixture'
import { ProfileHeader } from 'features/profile/components/Header/ProfileHeader/ProfileHeader'
import { domains_credit_v3 } from 'features/profile/fixtures/domainsCredit'
import { isUserUnderageBeneficiary } from 'features/profile/helpers/isUserUnderageBeneficiary'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/__tests__/setFeatureFlags'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'

jest.mock('libs/network/NetInfoWrapper')

const user: UserProfileResponse = {
  bookedOffers: {},
  email: 'email2@domain.ext',
  hasPassword: true,
  firstName: 'Jean',
  isBeneficiary: true,
  birthDate: '2003-01-01',
  depositExpirationDate: '2023-02-09T11:17:14.786670',
  domainsCredit: domains_credit_v3,
  lastName: '93 HNMM 2',
  id: 1234,
  needsToFillCulturalSurvey: true,
  isEligibleForBeneficiaryUpgrade: false,
  requiresIdCheck: false,
  roles: [],
  showEligibleCard: false,
  subscriptions: {
    marketingEmail: true,
    marketingPush: true,
  },
  status: { statusType: YoungStatusType.beneficiary },
  currency: CurrencyEnum.EUR,
  achievements: [],
}

const exBeneficiaryUser: UserProfileResponse = {
  ...user,
  depositExpirationDate: '2020-01-01T03:04:05',
}

const notBeneficiaryUser = {
  ...user,
  isBeneficiary: false,
}

const exUnderageBeneficiaryUser: UserProfileResponse = {
  ...user,
  depositExpirationDate: '2020-01-01T03:04:05',
  isEligibleForBeneficiaryUpgrade: true,
}

jest.mock('libs/jwt/jwt')
jest.mock('features/profile/api/usePatchProfile')
jest.mock('features/profile/helpers/isUserUnderageBeneficiary')
const mockedisUserUnderageBeneficiary = jest.mocked(isUserUnderageBeneficiary)

jest.mock('features/auth/context/AuthContext', () => ({
  useAuthContext: jest.fn(() => ({ isLoggedIn: true })),
}))

jest.mock('libs/firebase/analytics/analytics')

describe('ProfileHeader', () => {
  beforeEach(() => {
    setFeatureFlags()
    mockdate.set('2021-07-01T00:00:00Z')
    mockServer.getApi<SubscriptionStepperResponseV2>(
      '/v2/subscription/stepper',
      subscriptionStepperFixture
    )
  })

  it('should not display subtitle with passForAll enabled', async () => {
    renderProfileHeader({
      featureFlags: {
        enableAchievements: false,
        disableActivation: false,
        enablePassForAll: true,
      },
      user: undefined,
    })
    await screen.findByText('Cheatcodes')

    const subtitle = 'Tu as 17 ou 18 ans\u00a0?'

    expect(screen.queryByText(subtitle)).not.toBeOnTheScreen()
  })

  it('should display the LoggedOutHeader if no user', async () => {
    renderProfileHeader({
      featureFlags: {
        enableAchievements: false,
        disableActivation: false,
        enablePassForAll: false,
      },
      user: undefined,
    })

    await screen.findByText('Cheatcodes')

    expect(
      screen.getByText(
        'Envie d’explorer des offres culturelles ou de débloquer ton crédit si tu as entre 15 et 18 ans ?'
      )
    ).toBeOnTheScreen()
  })

  it('should display the BeneficiaryHeader if user is beneficiary', async () => {
    renderProfileHeader({
      featureFlags: {
        enableAchievements: false,
        disableActivation: false,
        enablePassForAll: false,
      },
      user,
    })

    await screen.findByText('Cheatcodes')

    expect(screen.getByText('Profite de ton crédit jusqu’au')).toBeOnTheScreen()
  })

  it('should display the BeneficiaryHeader if user is underage beneficiary', async () => {
    mockedisUserUnderageBeneficiary.mockReturnValueOnce(true)
    renderProfileHeader({
      featureFlags: {
        enableAchievements: false,
        disableActivation: false,
        enablePassForAll: false,
      },
      user,
    })

    await screen.findByText('Cheatcodes')

    expect(screen.getByText('Profite de ton crédit jusqu’au')).toBeOnTheScreen()
  })

  it('should display the ExBeneficiary Header if credit is expired', async () => {
    renderProfileHeader({
      featureFlags: {
        enableAchievements: false,
        disableActivation: false,
        enablePassForAll: false,
      },
      user: exBeneficiaryUser,
    })

    await screen.findByText('Cheatcodes')

    expect(screen.getByText('Ton crédit a expiré le')).toBeOnTheScreen()
  })

  it('should display the NonBeneficiaryHeader Header if user is not beneficiary', async () => {
    mockServer.getApi<BannerResponse>('/v1/banner', {
      banner: {
        name: BannerName.activation_banner,
        text: 'à dépenser sur l’application',
        title: 'Débloque tes 1000\u00a0€',
      },
    })

    renderProfileHeader({
      featureFlags: {
        enableAchievements: false,
        disableActivation: false,
        enablePassForAll: false,
      },
      user: notBeneficiaryUser,
    })

    expect(await screen.findByText('Débloque tes 1000\u00a0€')).toBeOnTheScreen()
  })

  it('should display the NonBeneficiaryHeader Header if user is eligible exunderage beneficiary', async () => {
    mockServer.getApi<BannerResponse>('/v1/banner', {})
    renderProfileHeader({
      featureFlags: {
        enableAchievements: false,
        disableActivation: false,
        enablePassForAll: false,
      },
      user: exUnderageBeneficiaryUser,
    })

    expect(await screen.findByText('Mon profil')).toBeOnTheScreen()
  })
})

const renderProfileHeader = ({
  featureFlags,
  user,
}: {
  featureFlags: {
    enableAchievements: boolean
    disableActivation: boolean
    enablePassForAll: boolean
  }
  user?: UserProfileResponse
}) => render(reactQueryProviderHOC(<ProfileHeader featureFlags={featureFlags} user={user} />))
