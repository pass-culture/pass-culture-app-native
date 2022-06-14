import React from 'react'

import { render } from 'tests/utils'
import { categoriesIcons } from 'ui/svg/icons/bicolor/exports/categoriesIcons'

import { CategoriesButtons } from './CategoriesButtons'

describe('CategoriesButtons', () => {
  it('should sort search group names alphabetically', () => {
    const { getAllByText } = render(
      <CategoriesButtons
        categories={[
          {
            label: 'Musique - label',
            Icon: categoriesIcons.Music,
            onPress: jest.fn(),
          },
          {
            label: 'Cinéma - label',
            Icon: categoriesIcons.Cinema,
            onPress: jest.fn(),
          },
          {
            label: 'Livre - label',
            Icon: categoriesIcons.Book,
            onPress: jest.fn(),
          },
          {
            label: 'Théâtre - label',
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
