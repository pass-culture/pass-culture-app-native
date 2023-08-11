import React from 'react'

import { SearchCategoriesIllustrations } from 'features/internal/cheatcodes/pages/AppComponents/illustrationsExports'
import { fireEvent, render } from 'tests/utils'
import { theme } from 'theme'

import { CategoryButton } from './CategoryButton'

describe('CategoryButton', () => {
  it('should render correctly', () => {
    const categoryButton = render(
      <CategoryButton
        label="Bibliothèques & Médiathèques"
        Illustration={SearchCategoriesIllustrations.LibrariesMediaLibraries}
        baseColor="#870087"
        onPress={jest.fn()}
        gradients={[theme.colors.deepPinkLight, theme.colors.deepPink]}
      />
    )
    expect(categoryButton).toMatchSnapshot()
  })

  it('should execute search on category click', () => {
    const handleClick = jest.fn()
    const { getByRole } = render(
      <CategoryButton
        label="Bibliothèques & Médiathèques"
        Illustration={SearchCategoriesIllustrations.LibrariesMediaLibraries}
        baseColor="#870087"
        onPress={handleClick}
        gradients={[theme.colors.deepPinkLight, theme.colors.deepPink]}
      />
    )

    const button = getByRole('button')
    fireEvent.press(button)

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should be self-explanatory to be accessible', () => {
    const handleClick = jest.fn()
    const { getByLabelText } = render(
      <CategoryButton
        label="Bibliothèques & Médiathèques"
        Illustration={SearchCategoriesIllustrations.LibrariesMediaLibraries}
        onPress={handleClick}
        gradients={[theme.colors.deepPinkLight, theme.colors.deepPink]}
      />
    )

    const button = getByLabelText('Catégorie Bibliothèques & Médiathèques')
    fireEvent.press(button)

    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
