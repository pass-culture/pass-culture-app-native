import React from 'react'

import { CookiesDetails } from 'features/cookies/pages/CookiesDetails'
import { checkAccessibilityFor, render, flushAllPromisesWithAct } from 'tests/utils/web'

jest.mock('features/profile/api/useUpdateProfileMutation')

describe('<CookiesDetails/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(
        <CookiesDetails
          settingsCookiesChoice={{
            marketing: false,
            performance: false,
            customization: false,
          }}
          setSettingsCookiesChoice={jest.fn()}
        />
      )

      await flushAllPromisesWithAct()
      const results = await checkAccessibilityFor(container, {
        rules: {
          // TODO(LucasBeneston): throw an error because the UUIDV4 mock return "testUuidV4"
          'duplicate-id-aria': { enabled: false }, // error: "IDs used in ARIA and labels must be unique (duplicate-id-aria)"
        },
      })

      expect(results).toHaveNoViolations()
    })
  })
})
