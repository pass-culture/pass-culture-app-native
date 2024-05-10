import React from 'react'

import { BooksNativeCategoriesEnum } from 'features/search/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'
import { theme } from 'theme'
import { SubcategoryButtonList } from 'ui/components/buttons/SubcategoryButton/SubcategoryButtonList'

const bookColorsGradient = [theme.colors.deepPinkLight, theme.colors.deepPink]
const subcategoryButtonContent = [
  {
    label: 'Romans et littérature',
    colors: bookColorsGradient,
    nativeCategory: BooksNativeCategoriesEnum.ROMANS_ET_LITTERATURE,
  },
  {
    label: 'Mangas',
    colors: bookColorsGradient,
    nativeCategory: BooksNativeCategoriesEnum.MANGAS,
  },
  {
    label: 'BD & Comics',
    colors: bookColorsGradient,
    nativeCategory: BooksNativeCategoriesEnum.BD_ET_COMICS,
  },
]

describe('<SubcategoryButtonList/>', () => {
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
