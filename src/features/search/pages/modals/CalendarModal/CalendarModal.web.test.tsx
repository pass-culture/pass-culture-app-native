import React from 'react'

import { initialSearchState } from 'features/search/context/reducer'
import { ISearchContext } from 'features/search/context/SearchWrapper'
import { FilterBehaviour } from 'features/search/enums'
import { CalendarModal } from 'features/search/pages/modals/CalendarModal/CalendarModal'
import { act, checkAccessibilityFor, render } from 'tests/utils/web'

const mockDispatch = jest.fn()

const initialMockUseSearch = {
  searchState: initialSearchState,
  dispatch: mockDispatch,
}
const mockUseSearch: jest.Mock<Partial<ISearchContext>> = jest.fn(() => initialMockUseSearch)
jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => mockUseSearch(),
}))

describe('<CalendarModal/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(
        <CalendarModal
          title="Dates"
          accessibilityLabel="Ne pas filtrer sur les dates"
          isVisible
          hideModal={jest.fn()}
          filterBehaviour={FilterBehaviour.SEARCH}
        />
      )

      await act(async () => {
        const results = await checkAccessibilityFor(container)

        expect(results).toHaveNoViolations()
      })
    })
  })
})
