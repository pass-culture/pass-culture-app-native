import React from 'react'

import { ProfileLoggedOut } from 'features/profile/containers/ProfileLoggedOut/ProfileLoggedOut'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { checkAccessibilityFor, render, screen } from 'tests/utils/web'
import * as useVersion from 'ui/hooks/useVersion'

jest.mock('libs/firebase/analytics/analytics')
jest.spyOn(useVersion, 'useVersion').mockReturnValue('Version\u00A01.100.1')

describe('<ProfileLoggedOut />', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = await renderProfileLoggedOut()

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})

const renderProfileLoggedOut = async () => {
  const renderResult = render(
    reactQueryProviderHOC(
      <ProfileLoggedOut
        featureFlags={{
          enablePassForAll: true,
          enableProfileV2: true,
          disableActivation: false,
        }}
      />
    )
  )
  await screen.findByTestId('profile-logged-out')
  return renderResult
}
