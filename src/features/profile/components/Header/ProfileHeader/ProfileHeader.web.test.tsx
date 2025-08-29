import mockdate from 'mockdate'
import React from 'react'

import { ProfileHeader } from 'features/profile/components/Header/ProfileHeader/ProfileHeader'
import { profileHeaderUser, profileHeaderUserExBeneficiaryUser } from 'fixtures/user'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { remoteConfigResponseFixture } from 'libs/firebase/remoteConfig/fixtures/remoteConfigResponse.fixture'
import * as useRemoteConfigQuery from 'libs/firebase/remoteConfig/queries/useRemoteConfigQuery'
import { render, screen } from 'tests/utils/web'

jest.mock('libs/firebase/analytics/analytics')
jest
  .spyOn(useRemoteConfigQuery, 'useRemoteConfigQuery')
  .mockReturnValue(remoteConfigResponseFixture)
jest.mock('queries/profile/usePatchProfileMutation')
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
        user={profileHeaderUser}
      />
    )

    expect(screen.getByText('Profite de ton crédit jusqu’au')).toBeInTheDocument()
  })

  it('should display the ExBeneficiary Header if credit is expired', () => {
    render(
      <ProfileHeader
        featureFlags={{ disableActivation: false, enablePassForAll: false }}
        user={profileHeaderUserExBeneficiaryUser}
      />
    )

    expect(screen.getByText('Ton crédit a expiré le')).toBeInTheDocument()
  })

  it('should not display achievement banner', () => {
    render(
      <ProfileHeader
        featureFlags={{ disableActivation: false, enablePassForAll: false }}
        user={profileHeaderUser}
      />
    )

    const achievementBannerTitle = screen.queryByText('Mes succès')

    expect(achievementBannerTitle).not.toBeInTheDocument()
  })
})
