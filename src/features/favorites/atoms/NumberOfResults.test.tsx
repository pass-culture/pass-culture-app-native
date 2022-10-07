import React from 'react'

import { render } from 'tests/utils'

import { NumberOfResults } from './NumberOfResults'

describe('NumberOfResults component', () => {
  it('should correctly format the number of favorites', () => {
    expect(render(<NumberOfResults nbFavorites={0} />).toJSON()).toBeNull()
    expect(render(<NumberOfResults nbFavorites={1} />).getByText('1 favori')).toBeTruthy()
    expect(render(<NumberOfResults nbFavorites={2} />).getByText('2 favoris')).toBeTruthy()
    expect(render(<NumberOfResults nbFavorites={1234} />).getByText('1 234 favoris')).toBeTruthy()
  })
})
