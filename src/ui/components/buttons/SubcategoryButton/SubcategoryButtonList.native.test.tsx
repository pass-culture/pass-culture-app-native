import React from 'react'

import { initialSearchState } from 'features/search/context/reducer'
import { BooksNativeCategoriesEnum } from 'features/search/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'
import { theme } from 'theme'
import { SubcategoryButtonList } from 'ui/components/buttons/SubcategoryButton/SubcategoryButtonList'

const colors = { backgroundColor: theme.colors.deepPink, borderColor: theme.colors.deepPinkDark }
const subcategoryButtonContent = [
  {
    label: 'Romans et littérature',
    ...colors,
    nativeCategory: BooksNativeCategoriesEnum.ROMANS_ET_LITTERATURE,
  },
  {
    label: 'Mangas',
    ...colors,
    nativeCategory: BooksNativeCategoriesEnum.MANGAS,
  },
  {
    label: 'BD & Comics',
    ...colors,
    nativeCategory: BooksNativeCategoriesEnum.BD_ET_COMICS,
  },
]

const mockSearchState = initialSearchState
jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
    dispatch: jest.fn(),
  }),
}))

jest.mock('libs/firebase/analytics/analytics')

describe('<SubcategoryButtonList/>', () => {
  // TODO(PC-28526): Remove this snapshot when story fixed
  it('should render SubcategoryButtonList', async () => {
    render(
      reactQueryProviderHOC(
        <SubcategoryButtonList subcategoryButtonContent={subcategoryButtonContent} />
      )
    )

    await screen.findByText('Romans et littérature')

    expect(screen).toMatchSnapshot()
  })
})
