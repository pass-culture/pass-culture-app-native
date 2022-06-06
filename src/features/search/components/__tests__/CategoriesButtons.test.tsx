import React from 'react'

import { CategoriesButtons } from 'features/search/components/CategoriesButtons'
import { render } from 'tests/utils'
import { categoriesIcons } from 'ui/svg/icons/bicolor/exports/categoriesIcons'

describe('CategoriesButtons', () => {
  it('should sort search group names alphabetically', () => {
    const { getAllByText } = render(
      <CategoriesButtons
        categories={[
          {
            label: 'Musique - label',
            color: 'blue',
            Icon: categoriesIcons.Music,
            onPress: jest.fn(),
          },
          {
            label: 'Cinéma - label',
            color: 'royalblue',
            Icon: categoriesIcons.Cinema,
            onPress: jest.fn(),
          },
          {
            label: 'Livre - label',
            color: 'purple',
            Icon: categoriesIcons.Book,
            onPress: jest.fn(),
          },
          {
            label: 'Théâtre - label',
            color: 'green',
            Icon: categoriesIcons.Workshop,
            onPress: jest.fn(),
          },
        ]}
      />
    )

    const items = getAllByText(/ - label/)
    expect(items[0].props.children).toContain('Cinéma')
    expect(items[1].props.children).toContain('Livre')
    expect(items[2].props.children).toContain('Musique')
    expect(items[3].props.children).toContain('Théâtre')
  })
})
