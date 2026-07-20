import React from 'react'

import { initialSearchState } from 'features/search/context/reducer'
import { BooksNativeCategoriesEnum, NativeCategoryEnum } from 'features/search/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'
import { theme } from 'theme'
import { SubcategoryButtonItem } from 'ui/components/buttons/SubcategoryButton/SubcategoryButton'
import { SubcategoryButtonList } from 'ui/components/buttons/SubcategoryButton/SubcategoryButtonList'

const createSubcategoryButtonItem = (label: string, nativeCategory: NativeCategoryEnum) => ({
  backgroundColor: theme.designSystem.color.background.decorative01,
  borderColor: theme.designSystem.color.border.decorative01,
  label,
  nativeCategory,
  searchParams: initialSearchState,
  onBeforeNavigate: jest.fn(),
})

const subcategoryButtonContent: SubcategoryButtonItem[] = [
  createSubcategoryButtonItem(
    'Romans et littérature',
    BooksNativeCategoriesEnum.ROMANS_ET_LITTERATURE
  ),
  createSubcategoryButtonItem('Mangas', BooksNativeCategoriesEnum.MANGAS),
  createSubcategoryButtonItem('BD & Comics', BooksNativeCategoriesEnum.BD_ET_COMICS),
]

const longSubcategoryButtonContent: SubcategoryButtonItem[] = [
  ...subcategoryButtonContent,
  createSubcategoryButtonItem(
    'Loisirs & Bien-être',
    BooksNativeCategoriesEnum.LOISIRS_ET_BIEN_ETRE
  ),
  createSubcategoryButtonItem('Mode et Art', BooksNativeCategoriesEnum.MODE_ET_ART),
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
  it('should render SubcategoryButtonList', async () => {
    render(
      reactQueryProviderHOC(
        <SubcategoryButtonList subcategoryButtonContent={subcategoryButtonContent} />
      )
    )

    expect(await screen.findByText('Romans et littérature')).toBeOnTheScreen()
  })

  it('should display "Voir tout" when there are more than 4 subcategories', async () => {
    renderSubcategoryButtonList(longSubcategoryButtonContent)

    expect(await screen.findByText('Voir tout')).toBeOnTheScreen()
  })

  it('should not display "Voir tout" when there are 4 subcategories or less', () => {
    renderSubcategoryButtonList(subcategoryButtonContent)

    expect(screen.queryByText('Voir tout')).not.toBeOnTheScreen()
  })
})

const renderSubcategoryButtonList = (content: SubcategoryButtonItem[]) =>
  render(
    reactQueryProviderHOC(
      <SubcategoryButtonList
        subcategoryButtonContent={content}
        seeAllNavigateTo={{
          screen: 'ThematicSearchSubcategories',
          params: { offerCategories: [] },
        }}
      />
    )
  )
