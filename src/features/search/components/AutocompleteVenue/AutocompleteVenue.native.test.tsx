import { Hit } from '@algolia/client-search'
import { BaseHit } from 'instantsearch.js'
import React from 'react'

import { AutocompleteVenue } from 'features/search/components/AutocompleteVenue/AutocompleteVenue'
import { mockVenueHits } from 'features/search/fixtures/algolia'
import { render, screen } from 'tests/utils'

let mockHits: Hit<BaseHit>[] = []
jest.mock('react-instantsearch-hooks', () => ({
  useInfiniteHits: () => ({
    hits: mockHits,
  }),
}))

describe('AutocompleteVenue component', () => {
  describe('With venue hits', () => {
    beforeEach(() => {
      mockHits = mockVenueHits
    })

    it('should render AutocompleteVenue', () => {
      expect(render(<AutocompleteVenue />)).toMatchSnapshot()
    })

    it('should display "Points de vente"', () => {
      render(<AutocompleteVenue />)
      expect(screen.getByText('Points de vente')).toBeTruthy()
    })
  })

  describe('Without venue hits', () => {
    beforeEach(() => {
      mockHits = []
    })

    it('should not display "Points de vente"', () => {
      render(<AutocompleteVenue />)
      expect(screen.queryByText('Points de vente')).toBeFalsy()
    })
  })
})
