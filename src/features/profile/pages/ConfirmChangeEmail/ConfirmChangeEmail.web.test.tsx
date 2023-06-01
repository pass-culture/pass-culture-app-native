import React from 'react'

import * as useCheckHasCurrentEmailChange from 'features/profile/helpers/useCheckHasCurrentEmailChange'
import { ConfirmChangeEmail } from 'features/profile/pages/ConfirmChangeEmail/ConfirmChangeEmail'
import { checkAccessibilityFor, render } from 'tests/utils/web'

jest.spyOn(useCheckHasCurrentEmailChange, 'useCheckHasCurrentEmailChange').mockReturnValue({
  hasCurrentEmailChange: true,
})

describe('<ConfirmChangeEmail />', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<ConfirmChangeEmail />)
      const results = await checkAccessibilityFor(container)
      expect(results).toHaveNoViolations()
    })
  })
})
