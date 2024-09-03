import mockdate from 'mockdate'
import React from 'react'

import {
  BannerName,
  BannerResponse,
  SubscriptionStepperResponseV2,
  UserProfileResponse,
  YoungStatusType,
} from 'api/gen'
import { subscriptionStepperFixture } from 'features/identityCheck/fixtures/subscriptionStepperFixture'
import { ProfileHeader } from 'features/profile/components/Header/ProfileHeader/ProfileHeader'
import { domains_credit_v1 } from 'features/profile/fixtures/domainsCredit'
import { isUserUnderageBeneficiary } from 'features/profile/helpers/isUserUnderageBeneficiary'
import * as useFeatureFlag from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
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
  domainsCredit: domains_credit_v1,
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
jest.mock('features/profile/api/useUpdateProfileMutation')
jest.mock('features/profile/helpers/isUserUnderageBeneficiary')
const mockedisUserUnderageBeneficiary = jest.mocked(isUserUnderageBeneficiary)

jest.mock('features/auth/context/AuthContext', () => ({
  useAuthContext: jest.fn(() => ({ isLoggedIn: true })),
}))

jest.spyOn(useFeatureFlag, 'useFeatureFlag').mockReturnValue(false)

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

jest.mock('@batch.com/react-native-plugin', () =>
  jest.requireActual('__mocks__/libs/react-native-batch')
)

describe('ProfileHeader', () => {
  beforeEach(() => {
    mockdate.set('2021-07-01T00:00:00Z')
    mockServer.getApi<SubscriptionStepperResponseV2>(
      '/v2/subscription/stepper',
      subscriptionStepperFixture
    )
  })

  it('should display the LoggedOutHeader if no user', () => {
    renderProfileHeader({ user: undefined })

    expect(
      screen.getByText('Identifie-toi pour bénéficier de ton crédit pass Culture')
    ).toBeOnTheScreen()
  })

  it('should display the BeneficiaryHeader if user is beneficiary', () => {
    renderProfileHeader({ user })

    expect(screen.getByText('Profite de ton crédit jusqu’au')).toBeOnTheScreen()
  })

  it('should display the BeneficiaryHeader if user is underage beneficiary', () => {
    mockedisUserUnderageBeneficiary.mockReturnValueOnce(true)
    renderProfileHeader({ user })

    expect(screen.getByText('Profite de ton crédit jusqu’au')).toBeOnTheScreen()
  })

  it('should display the ExBeneficiary Header if credit is expired', () => {
    renderProfileHeader({ user: exBeneficiaryUser })

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

    renderProfileHeader({ user: notBeneficiaryUser })

    expect(await screen.findByText('Débloque tes 1000\u00a0€')).toBeOnTheScreen()
  })

  it('should display the NonBeneficiaryHeader Header if user is eligible exunderage beneficiary', async () => {
    mockServer.getApi<BannerResponse>('/v1/banner', {})
    renderProfileHeader({ user: exUnderageBeneficiaryUser })

    expect(await screen.findByText('Mon profil')).toBeOnTheScreen()
  })
})

const renderProfileHeader = ({ user }: { user?: UserProfileResponse }) =>
  render(reactQueryProviderHOC(<ProfileHeader user={user} />))
