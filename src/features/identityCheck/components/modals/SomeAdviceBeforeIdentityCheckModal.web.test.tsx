import React from 'react'

import { render, checkAccessibilityFor } from 'tests/utils/web'

import { SomeAdviceBeforeIdentityCheckModal } from './SomeAdviceBeforeIdentityCheckModal'

describe('<SomeAdviceBeforeIdentityCheckModal/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(
        <SomeAdviceBeforeIdentityCheckModal
          visible
          hideModal={jest.fn()}
          onPressContinue={jest.fn()}
        />
      )
      const results = await checkAccessibilityFor(container)
      expect(results).toHaveNoViolations()
    })
  })
})
