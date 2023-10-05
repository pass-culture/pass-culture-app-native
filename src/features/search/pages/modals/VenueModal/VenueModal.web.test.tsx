import React from 'react'

import { render, checkAccessibilityFor, waitForModalToShow, act } from 'tests/utils/web'

import { VenueModal } from './VenueModal'

const dismissModalMock = jest.fn()

describe('<VenueModal/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<VenueModal visible dismissModal={dismissModalMock} />)

      let results
      await act(async () => {
        await waitForModalToShow()

        results = await checkAccessibilityFor(container)
      })
      await act(async () => {})
      expect(results).toHaveNoViolations()
      await act(async () => {})
    })
  })
})
