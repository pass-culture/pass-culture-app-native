import React from 'react'

import { render } from 'tests/utils'

import { NumberOfResults } from '../NumberOfResults'

describe('NumberOfResults component', () => {
  it('should correctly format the number of hit', () => {
    expect(render(<NumberOfResults nbHits={0} />).toJSON()).toBeNull()
    expect(render(<NumberOfResults nbHits={1} />).getByText('1 résultat')).toBeTruthy()
    expect(render(<NumberOfResults nbHits={2} />).getByText('2 résultats')).toBeTruthy()
    expect(render(<NumberOfResults nbHits={1234} />).getByText('1234 résultats')).toBeTruthy()
  })
})
