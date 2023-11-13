import { Hit } from '@algolia/client-search'
import { BaseHit } from 'instantsearch.js'
import React from 'react'

import { AutocompleteVenue } from 'features/search/components/AutocompleteVenue/AutocompleteVenue'
import { mockVenueHits } from 'features/search/fixtures/algolia'
import { fireEvent, render, screen } from 'tests/utils'

let mockHits: Hit<BaseHit>[] = []
jest.mock('react-instantsearch-core', () => ({
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
      expect(render(<AutocompleteVenue onItemPress={jest.fn()} />)).toMatchSnapshot()
    })

    it('should display "Lieux culturels"', () => {
      render(<AutocompleteVenue onItemPress={jest.fn()} />)

      expect(screen.getByText('Lieux culturels')).toBeOnTheScreen()
    })

    it('should call `onItemPress` on press', async () => {
      const onItemPress = jest.fn()
      render(<AutocompleteVenue onItemPress={onItemPress} />)

      await fireEvent.press(screen.getByTestId('autocompleteVenueItem_9898'))

      expect(onItemPress).toHaveBeenCalledWith(9898)
    })
  })

  describe('Without venue hits', () => {
    beforeEach(() => {
      mockHits = []
    })

    it('should not display "Lieux culturels"', async () => {
      render(<AutocompleteVenue onItemPress={jest.fn()} />)

      expect(screen.queryByText('Lieux culturels')).not.toBeOnTheScreen()
    })
  })
})
