import React from 'react'

import { fireEvent, render } from 'tests/utils'
import { Bookstore } from 'ui/svg/icons/bicolor/Bookstore'

import { CategoryButton } from './CategoryButton'

describe('CategoryButton', () => {
  it('should render correctly', () => {
    const categoryButton = render(
      <CategoryButton
        label="Bibliothèques & Médiathèques"
        Icon={Bookstore}
        color="#870087"
        onPress={jest.fn()}
      />
    )
    expect(categoryButton).toMatchSnapshot()
  })

  it('should execute search on category click', () => {
    const handleClick = jest.fn()
    const { getByRole } = render(
      <CategoryButton
        label="Bibliothèques & Médiathèques"
        Icon={Bookstore}
        color="#870087"
        onPress={handleClick}
      />
    )

    const button = getByRole('button')
    fireEvent.press(button)

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should be self-explanatory to be accessible', () => {
    const handleClick = jest.fn()
    const { getByLabelText } = render(
      <CategoryButton label="Bibliothèques & Médiathèques" Icon={Bookstore} onPress={handleClick} />
    )

    const button = getByLabelText(
      'Retrouver les offres dans la catégorie Bibliothèques & Médiathèques'
    )
    fireEvent.press(button)

    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
