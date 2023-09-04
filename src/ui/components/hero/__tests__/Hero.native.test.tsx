import React from 'react'

import { CategoryIdEnum } from 'api/gen'
import { render } from 'tests/utils'

import { Hero } from '../Hero'

describe('HeroImage', () => {
  it('shows both placeholders when url is empty', () => {
    const { queryByTestId } = render(
      <Hero imageUrl={''} type="offer" categoryId={CategoryIdEnum.CINEMA} />
    )
    expect(queryByTestId('BackgroundPlaceholder')).toBeOnTheScreen()
    expect(queryByTestId('categoryIcon')).toBeOnTheScreen()
    expect(queryByTestId('imagePlaceholder')).toBeOnTheScreen()
  })

  it('shows both placeholders when url is undefined', () => {
    const { queryByTestId } = render(
      <Hero imageUrl={undefined} type="offer" categoryId={CategoryIdEnum.CINEMA} />
    )
    expect(queryByTestId('BackgroundPlaceholder')).toBeOnTheScreen()
    expect(queryByTestId('categoryIcon')).toBeOnTheScreen()
    expect(queryByTestId('imagePlaceholder')).toBeOnTheScreen()
  })

  it('does not show placeholders when an url is defined', () => {
    const { queryByTestId } = render(
      <Hero
        imageUrl={'some_url_to_some_resource'}
        type="offer"
        categoryId={CategoryIdEnum.CINEMA}
      />
    )
    expect(queryByTestId('BackgroundPlaceholder')).not.toBeOnTheScreen()
    expect(queryByTestId('categoryIcon')).not.toBeOnTheScreen()
    expect(queryByTestId('imagePlaceholder')).not.toBeOnTheScreen()
  })
})
