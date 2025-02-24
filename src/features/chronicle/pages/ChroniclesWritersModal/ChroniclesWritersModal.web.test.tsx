import React from 'react'

import { ChroniclesWritersModal } from 'features/chronicle/pages/ChroniclesWritersModal/ChroniclesWritersModal'
import { act, checkAccessibilityFor, render } from 'tests/utils/web'

describe('<ChroniclesWritersModal/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(
        <ChroniclesWritersModal
          isVisible
          closeModal={jest.fn()}
          onShowRecoButtonPress={jest.fn()}
        />
      )
      await act(async () => {
        const results = await checkAccessibilityFor(container)

        expect(results).toHaveNoViolations()
      })
    })
  })
})
