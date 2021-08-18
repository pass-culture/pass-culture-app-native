import { plural } from '@lingui/macro'
import React from 'react'

import { render } from 'tests/utils'

import { NumberOfResults } from '../NumberOfResults'

describe('NumberOfResults component', () => {
  it('should correctly format the number of hit', () => {
    const getResultText = (count: number) =>
      plural(count, {
        one: '# résultat',
        other: '# résultats',
      })
    expect(render(<NumberOfResults nbHits={0} />).toJSON()).toBeNull()
    expect(render(<NumberOfResults nbHits={1} />).findByText(getResultText(1))).toBeTruthy()
    expect(render(<NumberOfResults nbHits={2} />).findByText(getResultText(2))).toBeTruthy()
    expect(render(<NumberOfResults nbHits={1234} />).findByText(getResultText(1234))).toBeTruthy()
  })
})
