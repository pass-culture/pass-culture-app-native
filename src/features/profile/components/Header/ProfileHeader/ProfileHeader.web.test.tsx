import mockdate from 'mockdate'
import React from 'react'

import { CurrencyEnum, UserProfileResponse, YoungStatusType } from 'api/gen'
import { ProfileHeader } from 'features/profile/components/Header/ProfileHeader/ProfileHeader'
import { domains_credit_v3 } from 'features/profile/fixtures/domainsCredit'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import * as useRemoteConfigQuery from 'libs/firebase/remoteConfig/queries/useRemoteConfigQuery'
import { DEFAULT_REMOTE_CONFIG } from 'libs/firebase/remoteConfig/remoteConfig.constants'
import { render, screen } from 'tests/utils/web'

jest.mock('libs/firebase/analytics/analytics')
jest.mock('libs/firebase/remoteConfig/remoteConfig.services')
jest.spyOn(useRemoteConfigQuery, 'useRemoteConfigQuery').mockReturnValue(DEFAULT_REMOTE_CONFIG)

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
  isEligibleForBeneficiaryUpgrade: false,
  needsToFillCulturalSurvey: true,
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

jest.mock('queries/profile/usePatchProfileMutation')

const exBeneficiaryUser: UserProfileResponse = {
  ...user,
  depositExpirationDate: '2020-01-01T03:04:05',
}

jest.mock('features/auth/context/AuthContext', () => ({
  useAuthContext: jest.fn(() => ({ isLoggedIn: true })),
}))

describe('ProfileHeader', () => {
  beforeEach(() => {
    setFeatureFlags()
    mockdate.set('2021-07-01T00:00:00Z')
  })

  it('should display the BeneficiaryHeader if user is beneficiary', () => {
    render(
      <ProfileHeader
        featureFlags={{ disableActivation: false, enablePassForAll: false }}
        user={user}
      />
    )

    expect(screen.getByText('Profite de ton crédit jusqu’au')).toBeInTheDocument()
  })

  it('should display the ExBeneficiary Header if credit is expired', () => {
    render(
      <ProfileHeader
        featureFlags={{ disableActivation: false, enablePassForAll: false }}
        user={exBeneficiaryUser}
      />
    )

    expect(screen.getByText('Ton crédit a expiré le')).toBeInTheDocument()
  })

  it('should not display achievement banner', () => {
    render(
      <ProfileHeader
        featureFlags={{ disableActivation: false, enablePassForAll: false }}
        user={user}
      />
    )

    const achievementBannerTitle = screen.queryByText('Mes succès')

    expect(achievementBannerTitle).not.toBeInTheDocument()
  })
})
