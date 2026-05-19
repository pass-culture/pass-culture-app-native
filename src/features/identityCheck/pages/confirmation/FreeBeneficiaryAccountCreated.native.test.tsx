import React from 'react'

import { AccountState, RefreshRequestV2, SigninResponseV2 } from 'api/gen'
import { FreeBeneficiaryAccountCreated } from 'features/identityCheck/pages/confirmation/FreeBeneficiaryAccountCreated'
import * as ShareAppWrapperModule from 'features/share/context/ShareAppWrapper'
import { underageBeneficiaryUser } from 'fixtures/user'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { remoteConfigResponseFixture } from 'libs/firebase/remoteConfig/fixtures/remoteConfigResponse.fixture'
import * as useRemoteConfigQuery from 'libs/firebase/remoteConfig/queries/useRemoteConfigQuery'
import { mockAuthContextWithUser } from 'tests/AuthContextUtils'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')

jest
  .spyOn(useRemoteConfigQuery, 'useRemoteConfigQuery')
  .mockReturnValue(remoteConfigResponseFixture)

jest.mock('features/auth/context/AuthContext')

const mockShowAppModal = jest.fn()
jest
  .spyOn(ShareAppWrapperModule, 'useShareAppContext')
  .mockReturnValue({ showShareAppModal: mockShowAppModal })

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

describe('FreeBeneficiaryAccountCreated', () => {
  beforeEach(() => {
    setFeatureFlags()
    mockAuthContextWithUser(underageBeneficiaryUser, { persist: true })
    mockServer.postApi<SigninResponseV2>('/v2/signin', {
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
      accountState: AccountState.ACTIVE,
    })
    mockServer.postApi<RefreshRequestV2>('/v2/refresh_access_token', {
      deviceInfo: {
        deviceId: 'id',
        os: 'iOS',
        source: 'unknown',
      },
    })
  })

  const useRemoteConfigSpy = jest.spyOn(useRemoteConfigQuery, 'useRemoteConfigQuery')

  it('should render correctly', () => {
    render(reactQueryProviderHOC(<FreeBeneficiaryAccountCreated />))

    expect(screen).toMatchSnapshot()
  })

  it('should display the confirmation message', () => {
    render(reactQueryProviderHOC(<FreeBeneficiaryAccountCreated />))

    expect(screen.getByText('Tes informations ont bien été enregistrées.')).toBeTruthy()
  })

  it('should use remote config to get homeEntryIdFreeOffers', () => {
    render(reactQueryProviderHOC(<FreeBeneficiaryAccountCreated />))

    expect(useRemoteConfigSpy).toHaveBeenCalledTimes(1)
  })
})
