import React from 'react'

import { SearchCategoriesIllustrations } from 'features/search/enums'
import { fireEvent, render, screen } from 'tests/utils'
import { theme } from 'theme'

import { CategoryButton } from './CategoryButton'

describe('CategoryButton', () => {
  it('should execute search on category click', () => {
    const handleClick = jest.fn()

    render(
      <CategoryButton
        label="Bibliothèques & Médiathèques"
        Illustration={SearchCategoriesIllustrations.LibrariesMediaLibraries}
        baseColor={theme.colors.deepPinkLight}
        onPress={handleClick}
        gradients={[theme.colors.deepPink, theme.colors.deepPinkDark]}
        textColor={theme.colors.aquamarineDark}
        borderColor={theme.colors.deepPink}
        fillColor={theme.colors.deepPinkLight}
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
        gradients={[theme.colors.deepPink, theme.colors.deepPinkDark]}
        textColor={theme.colors.aquamarineDark}
        borderColor={theme.colors.deepPink}
        fillColor={theme.colors.deepPinkLight}
      />
    )

    const button = screen.getByLabelText('Catégorie Bibliothèques & Médiathèques')
    fireEvent.press(button)

    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
