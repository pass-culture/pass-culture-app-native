import React from 'react'

import { SearchGroupNameEnumv2 } from 'api/gen'
import { initialSearchState } from 'features/search/context/reducer'
import { BooksNativeCategoriesEnum } from 'features/search/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent } from 'tests/utils'
import { SubcategoryButtonListWrapper } from 'ui/components/buttons/SubcategoryButton/SubcategoryButtonListWrapper'

const mockSearchState = initialSearchState
const mockDispatch = jest.fn()
jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
    dispatch: mockDispatch,
  }),
}))

jest.mock('libs/firebase/analytics/analytics')

const user = userEvent.setup()
jest.useFakeTimers()

describe('<SubcategoryButtonListWrapper/>', () => {
  it('should display "Films à l’affiche" when offerCategory is "Cinema"', async () => {
    renderSubcategoryButtonListWrapper(SearchGroupNameEnumv2.CINEMA)

    expect(await screen.findByText('Films à l’affiche')).toBeOnTheScreen()
  })

  it('should display "Romans et littérature" when offerCategory is "Livres"', async () => {
    renderSubcategoryButtonListWrapper(SearchGroupNameEnumv2.LIVRES)

    expect(await screen.findByText('Romans et littérature')).toBeOnTheScreen()
  })

  it('should update searchState with correct params', async () => {
    renderSubcategoryButtonListWrapper(SearchGroupNameEnumv2.LIVRES)

    await screen.findByText('Romans et littérature')

    await user.press(await screen.findByText('Mangas'))

    expect(mockDispatch).toHaveBeenNthCalledWith(1, {
      type: 'SET_STATE',
      payload: expect.objectContaining({
        offerCategories: [SearchGroupNameEnumv2.LIVRES],
        offerNativeCategories: [BooksNativeCategoriesEnum.MANGAS],
      }),
    })
  })
})

const renderSubcategoryButtonListWrapper = (offerCategory: SearchGroupNameEnumv2) =>
  render(reactQueryProviderHOC(<SubcategoryButtonListWrapper offerCategory={offerCategory} />))
