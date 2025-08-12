import { Hit } from '@algolia/client-search'
import { BaseHit } from 'instantsearch.js'
import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { AutocompleteArtist } from 'features/search/components/AutocompleteArtist/AutocompleteArtist'
import { mockArtistHits } from 'features/search/fixtures/algolia'
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
      mockHits = mockArtistHits
    })

    it('should display "Artistes"', () => {
      render(<AutocompleteArtist onItemPress={jest.fn()} />)

      expect(screen.getByText('Artistes')).toBeOnTheScreen()
    })

    it('should call `onItemPress` on press', async () => {
      const onItemPress = jest.fn()
      render(<AutocompleteArtist onItemPress={onItemPress} />)

      await user.press(screen.getByTestId('autocompleteArtistItem_fffff77d'))

      expect(onItemPress).toHaveBeenCalledWith('fffff77d')
    })

    it('should navigate to artist page when pressing item', async () => {
      render(<AutocompleteArtist onItemPress={jest.fn()} />)

      await user.press(screen.getByTestId('autocompleteArtistItem_fffff77d'))

      expect(navigate).toHaveBeenCalledWith('Artist', { id: 'fffff77d' })
    })
  })

  describe('Without artist hits', () => {
    beforeEach(() => {
      mockHits = []
    })

    it('should not display "Artistes"', async () => {
      render(<AutocompleteArtist onItemPress={jest.fn()} />)

      expect(screen.queryByText('Artistes')).not.toBeOnTheScreen()
    })
  })
})
