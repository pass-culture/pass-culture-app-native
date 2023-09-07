import React from 'react'

import { NonEligible } from 'features/tutorial/types'
import { render, checkAccessibilityFor } from 'tests/utils/web'

import { NonEligibleModal } from './NonEligibleModal'

describe('<NonEligibleModal/>', () => {
  describe('Accessibility', () => {
    it.each(Object.values(NonEligible))(
      'should not have basic accessibility issues',
      async (modalType) => {
        const { container } = render(
          <NonEligibleModal visible hideModal={jest.fn()} modalType={modalType} />
        )

        const results = await checkAccessibilityFor(container)

        expect(results).toHaveNoViolations()
      }
    )
  })
})
