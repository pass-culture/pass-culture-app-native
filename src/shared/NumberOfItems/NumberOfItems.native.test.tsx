import React from 'react'

import { render, screen } from 'tests/utils'

import { NumberOfItems } from './NumberOfItems'

describe('NumberOfItems component', () => {
  it('should not render when nbItems is 0', () => {
    const { toJSON } = render(<NumberOfItems nbItems={0} />)

    expect(toJSON()).not.toBeOnTheScreen()
  })

  it('should format numbers greater than 1 000', () => {
    render(<NumberOfItems nbItems={1234} />)

    expect(screen.getByText('1 234 résultats')).toBeOnTheScreen()
  })

  describe('default', () => {
    it('should display results singular', () => {
      render(<NumberOfItems nbItems={1} />)

      expect(screen.getByText('1 résultat')).toBeOnTheScreen()
    })

    it('should display results plural', () => {
      render(<NumberOfItems nbItems={2} />)

      expect(screen.getByText('2 résultats')).toBeOnTheScreen()
    })
  })

  describe('offers', () => {
    it('should display "offre" when single offer', () => {
      render(<NumberOfItems nbItems={1} type="offers" />)

      expect(screen.getByText('1 offre')).toBeOnTheScreen()
    })

    it('should display "offres" when multiple offers', () => {
      render(<NumberOfItems nbItems={2} type="offers" />)

      expect(screen.getByText('2 offres')).toBeOnTheScreen()
    })
  })

  describe('artists', () => {
    it('should display "artiste" when single artist', () => {
      render(<NumberOfItems nbItems={1} type="artists" />)

      expect(screen.getByText('1 artiste')).toBeOnTheScreen()
    })

    it('should display "artistes" when multiple artists', () => {
      render(<NumberOfItems nbItems={2} type="artists" />)

      expect(screen.getByText('2 artistes')).toBeOnTheScreen()
    })
  })

  describe('venues', () => {
    it('should display "lieu" when single venue', () => {
      render(<NumberOfItems nbItems={1} type="venues" />)

      expect(screen.getByText('1 lieu')).toBeOnTheScreen()
    })

    it('should display "lieux" when multiple venues', () => {
      render(<NumberOfItems nbItems={2} type="venues" />)

      expect(screen.getByText('2 lieux')).toBeOnTheScreen()
    })
  })
})
