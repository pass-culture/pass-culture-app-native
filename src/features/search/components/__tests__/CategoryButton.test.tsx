import React from 'react'

import { CategoryButton } from 'features/search/components/CategoryButton'
import { render } from 'tests/utils'
import { Bookstore } from 'ui/svg/icons/bicolor/Bookstore'

describe('CategoryButton', () => {
  it('should render correctly', () => {
    const categoryButton = render(
      <CategoryButton label="Bibliothèques & Médiathèques" Icon={Bookstore} color="#870087" />
    )
    expect(categoryButton).toMatchSnapshot()
  })
})
