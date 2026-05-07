import React from 'react'

import { AccountState, RefreshRequestV2, SigninResponseV2 } from 'api/gen'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, checkAccessibilityFor, screen } from 'tests/utils/web'

import { BeneficiaryAccountCreated } from './BeneficiaryAccountCreated'

jest.mock('features/auth/context/AuthContext')

jest.mock('libs/firebase/analytics/analytics')

describe('<BeneficiaryAccountCreated/>', () => {
  beforeEach(() => {
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

  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      setFeatureFlags([])
      const { container } = render(reactQueryProviderHOC(<BeneficiaryAccountCreated />))

      await screen.findByLabelText('C’est parti !')

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
