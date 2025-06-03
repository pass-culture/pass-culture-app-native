import React from 'react'

import { ChangeEmailSetPassword } from 'features/profile/pages/ChangeEmailSetPassword/ChangeEmailSetPassword'
import * as useRemoteConfigQuery from 'libs/firebase/remoteConfig/queries/useRemoteConfigQuery'
import { DEFAULT_REMOTE_CONFIG } from 'libs/firebase/remoteConfig/remoteConfig.constants'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, checkAccessibilityFor, render } from 'tests/utils/web'

// Fix the error "IDs used in ARIA and labels must be unique (duplicate-id-aria)" because the UUIDV4 mock returns "testUuidV4"
jest.mock('uuid', () => {
  let value = 0
  return {
    v1: jest.fn(),
    v4: jest.fn(() => value++),
  }
})

jest.spyOn(useRemoteConfigQuery, 'useRemoteConfigQuery').mockReturnValue(DEFAULT_REMOTE_CONFIG)

describe('<ChangeEmailSetPassword />', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(reactQueryProviderHOC(<ChangeEmailSetPassword />))

      await act(async () => {
        const results = await checkAccessibilityFor(container)

        expect(results).toHaveNoViolations()
      })
    })
  })
})
