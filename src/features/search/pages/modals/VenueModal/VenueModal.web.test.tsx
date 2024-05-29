import React from 'react'

import { initialSearchState } from 'features/search/context/reducer'
import { checkAccessibilityFor, render } from 'tests/utils/web'

import { VenueModal } from './VenueModal'

const dismissModalMock = jest.fn()

const mockSearchState = initialSearchState
jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
    dispatch: jest.fn(),
  }),
}))

describe('<VenueModal/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<VenueModal visible dismissModal={dismissModalMock} />)

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
