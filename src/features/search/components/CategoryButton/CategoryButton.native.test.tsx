import React from 'react'

import { SearchCategoriesIllustrations } from 'features/internal/cheatcodes/pages/AppComponents/illustrationsExports'
import { fireEvent, render, screen } from 'tests/utils'
import { theme } from 'theme'

import { CategoryButton } from './CategoryButton'

describe('CategoryButton', () => {
  it('should render correctly', () => {
    render(
      <CategoryButton
        label="Bibliothèques & Médiathèques"
        Illustration={SearchCategoriesIllustrations.LibrariesMediaLibraries}
        baseColor="#870087"
        onPress={jest.fn()}
        gradients={[theme.colors.deepPinkLight, theme.colors.deepPink]}
      />
    )
    expect(screen).toMatchSnapshot()
  })

  it('should execute search on category click', () => {
    const handleClick = jest.fn()

    render(
      <CategoryButton
        label="Bibliothèques & Médiathèques"
        Illustration={SearchCategoriesIllustrations.LibrariesMediaLibraries}
        baseColor="#870087"
        onPress={handleClick}
        gradients={[theme.colors.deepPinkLight, theme.colors.deepPink]}
      />
    )

    const button = screen.getByRole('button')
    fireEvent.press(button)

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should be self-explanatory to be accessible', () => {
    const handleClick = jest.fn()

    render(
      <CategoryButton
        label="Bibliothèques & Médiathèques"
        Illustration={SearchCategoriesIllustrations.LibrariesMediaLibraries}
        onPress={handleClick}
        gradients={[theme.colors.deepPinkLight, theme.colors.deepPink]}
      />
    )

    const button = screen.getByLabelText('Catégorie Bibliothèques & Médiathèques')
    fireEvent.press(button)

    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
