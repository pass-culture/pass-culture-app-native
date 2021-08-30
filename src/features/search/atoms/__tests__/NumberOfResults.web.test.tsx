import { plural } from '@lingui/macro'
import React from 'react'

import { venueResponseSnap } from 'features/venue/fixtures/venueResponseSnap'
import { render } from 'tests/utils/web'

import { NumberOfResults } from '../NumberOfResults'

const venueId = venueResponseSnap.id

jest.mock('react-query')

describe('NumberOfResults component', () => {
  it('should correctly format the number of hit', () => {
    const getResultText = (count: number) =>
      plural(count, {
        one: '# résultat',
        other: '# résultats',
      })
    expect(render(<NumberOfResults nbHits={0} venueId={venueId} />).container.textContent).toBe('')
    expect(render(<NumberOfResults nbHits={1} venueId={venueId} />).getByText(getResultText(1)))
    expect(render(<NumberOfResults nbHits={2} venueId={venueId} />).getByText(getResultText(2)))
    expect(
      render(<NumberOfResults nbHits={1234} venueId={venueId} />).getByText(getResultText(1234))
    )
  })
})
