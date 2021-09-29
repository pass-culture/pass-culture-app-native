import React from 'react'

import { CategoryIdEnum } from 'api/gen'
import { render } from 'tests/utils/web'

import { Hero } from '../Hero'

describe('HeroImage', () => {
  it('shows both placeholders when url is empty', () => {
    const { queryByTestId } = render(
      <Hero imageUrl={''} type="offer" categoryId={CategoryIdEnum.CINEMA} />
    )
    expect(queryByTestId('BackgroundPlaceholder')).toBeTruthy()
    expect(queryByTestId('categoryIcon')).toBeTruthy()
    expect(queryByTestId('imagePlaceholder')).toBeTruthy()
  })

  it('shows both placeholders when url is undefined', () => {
    const { queryByTestId } = render(
      <Hero imageUrl={undefined} type="offer" categoryId={CategoryIdEnum.CINEMA} />
    )
    expect(queryByTestId('BackgroundPlaceholder')).toBeTruthy()
    expect(queryByTestId('categoryIcon')).toBeTruthy()
    expect(queryByTestId('imagePlaceholder')).toBeTruthy()
  })
})
