import React from 'react'

import { VenueTypeModal } from 'features/venueMap/pages/modals/VenueTypeModal'
import { checkAccessibilityFor, render, screen } from 'tests/utils/web'

describe('<VenueTypeModal />', () => {
  it('should display mobile header modal if mobile viewport', () => {
    render(<VenueTypeModal venueType={null} hideModal={jest.fn()} isVisible />)

    expect(screen.getByTestId('pageHeader')).toBeInTheDocument()
  })

  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(
        <VenueTypeModal venueType={null} hideModal={jest.fn()} isVisible />
      )

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
