import React from 'react'

import { SearchGroupNameEnum } from 'api/gen'
import { SearchRework } from 'features/search/pages/SearchRework'
import { SearchWrapper } from 'features/search/pages/SearchWrapper'
import * as useShowResultsForCategory from 'features/search/pages/useShowResultsForCategory'
import { fireEvent, render } from 'tests/utils'

jest.mock('features/search/pages/useSearchResults', () => ({
  useSearchResults: () => ({
    data: { pages: [{ nbHits: 0, hits: [], page: 0 }] },
    hits: [],
    nbHits: 0,
    isFetching: false,
    isLoading: false,
    hasNextPage: false,
    fetchNextPage: jest.fn(),
    isFetchingNextPage: false,
  }),
}))

describe('SearchRework component', () => {
  describe('When search not executed', () => {
    it('should display categories buttons', () => {
      const { getByTestId } = render(<SearchRework />, { wrapper: SearchWrapper })

      const categoriesButtons = getByTestId('categoriesButtons')

      expect(categoriesButtons).toBeTruthy()
    })

    it('should show results for a category when pressing a category button', async () => {
      const mockShowResultsForCategory = jest.fn()
      jest
        .spyOn(useShowResultsForCategory, 'useShowResultsForCategory')
        .mockReturnValueOnce(mockShowResultsForCategory)
      const { getByText } = render(<SearchRework />)

      const categoryButton = getByText('Spectacles')
      await fireEvent.press(categoryButton)

      expect(mockShowResultsForCategory).toHaveBeenCalledWith(SearchGroupNameEnum.SPECTACLE)
    })
  })
})
