import React from 'react'

import { CookiesDetails } from 'features/cookies/pages/CookiesDetails'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { checkAccessibilityFor, render, flushAllPromisesWithAct } from 'tests/utils/web'

jest.mock('features/profile/api/useUpdateProfileMutation')

// Fix the error "IDs used in ARIA and labels must be unique (duplicate-id-aria)" because the UUIDV4 mock return "testUuidV4"
jest.mock('uuid', () => {
  let value = 0
  return {
    v1: jest.fn(),
    v4: jest.fn(() => value++),
  }
})

describe('<CookiesDetails/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(
        reactQueryProviderHOC(
          <CookiesDetails
            settingsCookiesChoice={{
              marketing: false,
              performance: false,
              customization: false,
            }}
            setSettingsCookiesChoice={jest.fn()}
          />
        )
      )

      await flushAllPromisesWithAct()
      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
