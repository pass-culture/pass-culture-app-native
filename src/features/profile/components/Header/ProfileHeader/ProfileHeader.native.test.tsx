import mockdate from 'mockdate'
import React from 'react'

import { BannerName, BannerResponse, EligibilityType, SubscriptionStepperResponseV2 } from 'api/gen'
import { subscriptionStepperFixture } from 'features/identityCheck/fixtures/subscriptionStepperFixture'
import { ProfileHeader } from 'features/profile/components/Header/ProfileHeader/ProfileHeader'
import { isUserUnderageBeneficiary } from 'features/profile/helpers/isUserUnderageBeneficiary'
import { ProfileFeatureFlagsProps } from 'features/profile/types'
import { UserProfileResponseWithoutSurvey } from 'features/share/types'
import { beneficiaryUser, exBeneficiaryUser, nonBeneficiaryUser } from 'fixtures/user'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'

jest.mock('libs/network/NetInfoWrapper')
jest.mock('libs/jwt/jwt')
jest.mock('queries/profile/usePatchProfileMutation')
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
    mockServer.getApi<BannerResponse>('/v1/banner', {
      banner: {
        name: BannerName.activation_banner,
        text: 'à dépenser sur l’application',
        title: 'Débloque tes 1000\u00a0€',
      },
    })
  })

  it('should not display subtitle with passForAll enabled', async () => {
    renderProfileHeader({
      featureFlags: { disableActivation: false, enablePassForAll: true, enableProfileV2: false },
      user: undefined,
    })
    await screen.findByText('Cheatcodes')

    const subtitle = 'Tu as 17 ou 18 ans\u00a0?'

    expect(screen.queryByText(subtitle)).not.toBeOnTheScreen()
  })

  it('should display the LoggedOutHeader if no user', async () => {
    renderProfileHeader({
      featureFlags: { disableActivation: false, enablePassForAll: false, enableProfileV2: false },
      user: undefined,
    })

    await screen.findByText('Cheatcodes')

    expect(
      await screen.findByText(
        'Envie d’explorer des offres culturelles ou de débloquer ton crédit si tu as 17 ou 18 ans ?'
      )
    ).toBeOnTheScreen()
  })

  it('should display the BeneficiaryHeader if user is beneficiary', async () => {
    renderProfileHeader({
      featureFlags: { disableActivation: false, enablePassForAll: false, enableProfileV2: false },
      user: beneficiaryUser,
    })

    await screen.findByText('Cheatcodes')

    expect(await screen.findByText('Profite de ton crédit jusqu’au')).toBeOnTheScreen()
  })

  it('should display the BeneficiaryHeader if user is underage beneficiary', async () => {
    mockedisUserUnderageBeneficiary.mockReturnValueOnce(true)
    renderProfileHeader({
      featureFlags: { disableActivation: false, enablePassForAll: false, enableProfileV2: false },
      user: beneficiaryUser,
    })

    await screen.findByText('Cheatcodes')

    expect(await screen.findByText('Profite de ton crédit jusqu’au')).toBeOnTheScreen()
  })

  it('should display the ExBeneficiary Header if credit is expired', async () => {
    renderProfileHeader({
      featureFlags: { disableActivation: false, enablePassForAll: false, enableProfileV2: false },
      user: exBeneficiaryUser,
    })

    await screen.findByText('Cheatcodes')

    expect(await screen.findByText('Ton crédit a expiré le')).toBeOnTheScreen()
  })

  it('should display the NonBeneficiaryHeader Header if user is not beneficiary', async () => {
    renderProfileHeader({
      featureFlags: { disableActivation: false, enablePassForAll: false, enableProfileV2: false },
      user: nonBeneficiaryUser,
    })

    expect(await screen.findByText('Débloque tes 1000\u00a0€')).toBeOnTheScreen()
  })

  it('should display the BeneficiaryAndEligibleForUpgradeHeader Header if user is beneficiary and isEligibleForBeneficiaryUpgrade and eligibility is 18 yo', async () => {
    renderProfileHeader({
      featureFlags: { disableActivation: false, enablePassForAll: false, enableProfileV2: false },
      user: {
        ...beneficiaryUser,
        isEligibleForBeneficiaryUpgrade: true,
        eligibility: EligibilityType['age-18'],
      },
    })

    expect(await screen.findByText('Jean Dupond')).toBeOnTheScreen()
    expect(await screen.findByText('Profite de ton crédit jusqu’au')).toBeOnTheScreen()
    expect(await screen.findByText('Débloque tes 1000\u00a0€')).toBeOnTheScreen()
  })
})

const renderProfileHeader = ({
  featureFlags,
  user,
}: {
  featureFlags: ProfileFeatureFlagsProps['featureFlags']
  user?: UserProfileResponseWithoutSurvey
}) => render(reactQueryProviderHOC(<ProfileHeader featureFlags={featureFlags} user={user} />))
