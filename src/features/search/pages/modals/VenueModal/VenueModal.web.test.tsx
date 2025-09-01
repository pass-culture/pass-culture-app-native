import React from 'react'

import { initialSearchState } from 'features/search/context/reducer'
import { checkAccessibilityFor, render, act, screen } from 'tests/utils/web'

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

      await screen.findByText('Trouver un lieu culturel')

      const results = await act(async () => checkAccessibilityFor(container))

      expect(results).toHaveNoViolations()
    })
  })
})
