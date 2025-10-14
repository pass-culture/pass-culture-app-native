import React from 'react'

import { CookiesDetails } from 'features/cookies/pages/CookiesDetails'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, checkAccessibilityFor, render } from 'tests/utils/web'

jest.mock('queries/profile/usePatchProfileMutation')

// Fix the error "IDs used in ARIA and labels must be unique (duplicate-id-aria)" because the UUIDV4 mock return "testUuidV4"
jest.mock('uuid', () => {
  let value = 0
  return {
    v1: jest.fn(),
    v4: jest.fn(() => value++),
  }
})

jest.mock('libs/firebase/analytics/analytics')

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
              video: false,
            }}
            setSettingsCookiesChoice={jest.fn()}
          />
        )
      )

      await act(async () => {
        const results = await checkAccessibilityFor(container)

        expect(results).toHaveNoViolations()
      })
    })
  })
})
