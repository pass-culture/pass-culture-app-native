import React from 'react'

import { BooksNativeCategoriesEnum } from 'features/search/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'
import { theme } from 'theme'
import { SubcategoryButton } from 'ui/components/buttons/SubcategoryButton/SubcategoryButton'

describe('<SubcategoryButton/>', () => {
  it('should render SubcategoryButton', async () => {
    render(
      reactQueryProviderHOC(
        <SubcategoryButton
          label="Mangas"
          colors={[theme.colors.deepPinkLight, theme.colors.deepPink]}
          nativeCategory={BooksNativeCategoriesEnum.MANGAS}
        />
      )
    )

    await screen.findByText('Mangas')

    expect(screen).toMatchSnapshot()
  })
})
