import React from 'react'

import OfferName from './OfferName'
import { render, screen } from 'tests/utils'

describe('OfferName component', () => {
  it('should display "Lorem" when db name is "lorem"', async () => {
    render(<OfferName title="lorem" />)

    expect(screen.queryByText('Lorem')).toBeOnTheScreen()
  })

  it('should display "Lorem" when db name is "Lorem"', async () => {
    render(<OfferName title="Lorem" />)

    expect(screen.queryByText('Lorem')).toBeOnTheScreen()
  })

  it('should display "LOREM" when db name is "LOREM"', async () => {
    render(<OfferName title="LOREM" />)

    expect(screen.queryByText('LOREM')).toBeOnTheScreen()
  })

  it('should display "Lorem" when db name is " lorem "', async () => {
    render(<OfferName title=" lorem" />)

    expect(screen.queryByText('Lorem')).toBeOnTheScreen()
  })

  it('should display "4orem" when db name is " 4orem "', async () => {
    render(<OfferName title=" 4orem " />)

    expect(screen.queryByText('4orem')).toBeOnTheScreen()
  })

  it(`should display "'lorem" when db name is " 'lorem"`, async () => {
    render(<OfferName title=" 'lorem" />)

    expect(screen.queryByText("'lorem")).toBeOnTheScreen()
  })
  it('should display "Lorem ipsum" when db name is "lorem ipsum"', async () => {
    render(<OfferName title="lorem ipsum" />)

    expect(screen.queryByText('Lorem ipsum')).toBeOnTheScreen()
  })
})
