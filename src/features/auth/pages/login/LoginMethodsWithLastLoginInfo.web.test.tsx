import React from 'react'

import { getLastLoginInfo } from 'features/auth/helpers/getLastLoginInfo'
import { FormattedLastLoginInfo, Provider } from 'features/auth/types'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { checkAccessibilityFor, render } from 'tests/utils/web'
import { EmailFilled } from 'ui/svg/icons/EmailFilled'
import { Apple } from 'ui/svg/icons/socialNetwork/Apple'
import { Google } from 'ui/svg/icons/socialNetwork/Google'

import { LoginMethodsWithLastLoginInfo } from './LoginMethodsWithLastLoginInfo'

jest.mock('libs/firebase/analytics/analytics')
jest.mock('features/auth/helpers/getLastLoginInfo')

const mockResetSearch = jest.fn()

jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: jest.fn(() => ({
    resetSearch: mockResetSearch,
  })),
}))

const mockIdentityCheckDispatch = jest.fn()

jest.mock('features/identityCheck/context/SubscriptionContextProvider', () => ({
  useSubscriptionContext: jest.fn(() => ({
    dispatch: mockIdentityCheckDispatch,
  })),
}))

const LAST_LOGIN_INFO_EMAIL: FormattedLastLoginInfo = {
  maskedEmail: 'rog*************@gmail.com',
  provider: { label: 'E-mail', icon: EmailFilled, type: Provider.EMAIL },
  lastLoginAt: '17/08/2026',
}

const LAST_LOGIN_INFO_GOOGLE: FormattedLastLoginInfo = {
  maskedEmail: 'rog*************@gmail.com',
  provider: { label: 'Google', icon: Google, type: Provider.GOOGLE },
  lastLoginAt: '17/08/2026',
}

const LAST_LOGIN_INFO_APPLE: FormattedLastLoginInfo = {
  maskedEmail: 'rog*************@apple.com',
  provider: { label: 'Apple', icon: Apple, type: Provider.APPLE },
  lastLoginAt: '17/08/2026',
}

describe('<LoginMethodsWithLastLoginInfo />', () => {
  beforeEach(() => {
    setFeatureFlags([])
    jest.mocked(getLastLoginInfo).mockResolvedValue(LAST_LOGIN_INFO_EMAIL)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('Accessibility', () => {
    it('should not have basic accessibility issues with email provider', async () => {
      jest.mocked(getLastLoginInfo).mockResolvedValueOnce(LAST_LOGIN_INFO_EMAIL)

      const { container } = render(reactQueryProviderHOC(<LoginMethodsWithLastLoginInfo />))

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })

    it('should not have basic accessibility issues with Google provider', async () => {
      jest.mocked(getLastLoginInfo).mockResolvedValueOnce(LAST_LOGIN_INFO_GOOGLE)

      const { container } = render(reactQueryProviderHOC(<LoginMethodsWithLastLoginInfo />))

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })

    it('should not have basic accessibility issues with Apple provider', async () => {
      setFeatureFlags([RemoteStoreFeatureFlags.WIP_ENABLE_APPLE_SSO])
      jest.mocked(getLastLoginInfo).mockResolvedValueOnce(LAST_LOGIN_INFO_APPLE)

      const { container } = render(reactQueryProviderHOC(<LoginMethodsWithLastLoginInfo />))

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
