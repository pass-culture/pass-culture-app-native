import React from 'react'

import { render, screen } from 'tests/utils'

import { NumberOfOffers } from './NumberOfOffers'

describe('NumberOfOffers component', () => {
  it('should correctly format the number of hit - without venue', () => {
    const { toJSON } = render(<NumberOfOffers nbHits={0} />)

    expect(toJSON()).not.toBeOnTheScreen()
  })

  it('should correctly format the number of hit when single', () => {
    render(<NumberOfOffers nbHits={1} />)

    expect(screen.getByText('1 offre')).toBeOnTheScreen()
  })

  it('should correctly format the number of hit when plural', () => {
    render(<NumberOfOffers nbHits={2} />)

    expect(screen.getByText('2 offres')).toBeOnTheScreen()
  })

  it('should correctly format the number of hit when more than 1 000', () => {
    render(<NumberOfOffers nbHits={1234} />)

    expect(screen.getByText('1 234 offres')).toBeOnTheScreen()
  })
})
