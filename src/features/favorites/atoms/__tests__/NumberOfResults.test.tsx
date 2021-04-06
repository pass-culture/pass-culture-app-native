import { plural } from '@lingui/macro'
import React from 'react'

import { render } from 'tests/utils'

import { NumberOfResults } from '../NumberOfResults'

describe('NumberOfResults component', () => {
  it('should correctly format the number of favorites', () => {
    const getResultText = (count: number) =>
      plural(count, {
        one: '# favori',
        other: '# favoris',
      })
    expect(render(<NumberOfResults nbFavorites={0} />).toJSON()).toBeNull()
    expect(render(<NumberOfResults nbFavorites={1} />).getByText(getResultText(1))).toBeTruthy()
    expect(render(<NumberOfResults nbFavorites={2} />).getByText(getResultText(2))).toBeTruthy()
    expect(
      render(<NumberOfResults nbFavorites={1234} />).getByText(getResultText(1234))
    ).toBeTruthy()
  })
})
