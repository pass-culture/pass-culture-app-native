import React from 'react'

import { initialSearchState } from 'features/search/context/reducer'
import { BooksNativeCategoriesEnum } from 'features/search/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'
import { theme } from 'theme'
import {
  SubcategoryButtonItem,
  SubcategoryButtonList,
} from 'ui/components/buttons/SubcategoryButton/SubcategoryButtonList'

const colors = { backgroundColor: theme.colors.deepPink, borderColor: theme.colors.deepPinkDark }
const subcategoryButtonContent: SubcategoryButtonItem[] = [
  {
    label: 'Romans et littérature',
    ...colors,
    categoryKey: BooksNativeCategoriesEnum.ROMANS_ET_LITTERATURE,
  },
  {
    label: 'Mangas',
    ...colors,
    categoryKey: BooksNativeCategoriesEnum.MANGAS,
  },
  {
    label: 'BD & Comics',
    ...colors,
    categoryKey: BooksNativeCategoriesEnum.BD_ET_COMICS,
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
jest.mock('features/navigation/TabBar/routes')

describe('<SubcategoryButtonList/>', () => {
  it('should render SubcategoryButtonList', async () => {
    render(
      reactQueryProviderHOC(
        <SubcategoryButtonList
          onPress={jest.fn()}
          subcategoryButtonContent={subcategoryButtonContent}
        />
      )
    )

    expect(await screen.findByText('Romans et littérature')).toBeOnTheScreen()
  })
})
