import React from 'react'

import { checkAccessibilityFor, render } from 'tests/utils/web'
import { Typo } from 'ui/theme'

import { GenericOfficialPage } from './GenericOfficialPage'

describe('<GenericOfficialPage />', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(
        <GenericOfficialPage title="Title">
          <Typo.Body>Children...</Typo.Body>
        </GenericOfficialPage>
      )

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
