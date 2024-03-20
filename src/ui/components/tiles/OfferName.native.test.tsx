import React from 'react'

import { render, screen } from 'tests/utils'

import { OfferName } from './OfferName'

describe('OfferName component', () => {
  it('should display not display nothing when title is filled', async () => {
    render(<OfferName title="filled" />)

    expect(JSON.stringify(screen)).not.toEqual(JSON.stringify(null))
  })

  it('should display nothing when title is just a space', async () => {
    render(<OfferName title=" " />)

    expect(JSON.stringify(screen)).toEqual(JSON.stringify(null))
  })

  it('should display "Lorem" when db name is " lorem"', async () => {
    render(<OfferName title=" lorem" />)

    expect(screen.getByText('Lorem')).toBeOnTheScreen()
  })
})
