import React from 'react'

import { render } from 'tests/utils'
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
})
