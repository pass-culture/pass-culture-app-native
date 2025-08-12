import { Hit } from '@algolia/client-search'
import { BaseHit } from 'instantsearch.js'
import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { AutocompleteVenue } from 'features/search/components/AutocompleteVenue/AutocompleteVenue'
import { mockVenueHits } from 'features/search/fixtures/algolia'
import { render, screen, userEvent } from 'tests/utils'

let mockHits: Hit<BaseHit>[] = []
jest.mock('react-instantsearch-core', () => ({
  useInfiniteHits: () => ({
    hits: mockHits,
  }),
}))
const user = userEvent.setup()
jest.useFakeTimers()

describe('AutocompleteVenue component', () => {
  describe('With venue hits', () => {
    beforeEach(() => {
      mockHits = mockVenueHits
    })

    it('should display "Lieux culturels"', () => {
      render(<AutocompleteVenue onItemPress={jest.fn()} />)

      expect(screen.getByText('Lieux culturels')).toBeOnTheScreen()
    })

    it('should call `onItemPress` on press', async () => {
      const onItemPress = jest.fn()
      render(<AutocompleteVenue onItemPress={onItemPress} />)

      await user.press(screen.getByTestId('autocompleteVenueItem_9898'))

      expect(onItemPress).toHaveBeenCalledWith(9898)
    })

    it('should navigate to venue page when pressing item', async () => {
      render(<AutocompleteVenue onItemPress={jest.fn()} />)

      await user.press(screen.getByTestId('autocompleteVenueItem_9898'))

      expect(navigate).toHaveBeenCalledWith('Venue', { id: 9898 })
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
