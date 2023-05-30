import React from 'react'

import { fireEvent, render, screen } from 'tests/utils'
import { theme } from 'theme'

import { VenueListItem, VenueSelectionList } from './VenueSelectionList'

const items: VenueListItem[] = [
  {
    title: 'Envie de lire',
    address: '94200 Ivry-sur-Seine, 16 rue Gabriel Peri',
    distance: '500 m',
    offerId: 1,
  },
  {
    title: 'Le Livre Éclaire',
    address: '75013 Paris, 56 rue de Tolbiac',
    distance: '1,5 km',
    offerId: 2,
  },
  {
    title: 'Hachette Livre',
    address: '94200 Ivry-sur-Seine, Rue Charles du Colomb',
    distance: '2,4 km',
    offerId: 3,
  },
]

const nbLoadedHits = 3
const nbHits = 40

describe('<VenueSelectionList />', () => {
  it('should show list of items', () => {
    render(
      <VenueSelectionList
        onItemSelect={jest.fn()}
        items={items}
        nbLoadedHits={nbLoadedHits}
        nbHits={nbHits}
        isFetchingNextPage
        autoScrollEnabled
      />
    )

    expect(screen.queryAllByTestId('venue-selection-list-item')).toHaveLength(3)
  })

  it('should select item on press', () => {
    const onItemSelect = jest.fn()

    render(
      <VenueSelectionList
        onItemSelect={onItemSelect}
        items={items}
        nbLoadedHits={nbLoadedHits}
        nbHits={nbHits}
        isFetchingNextPage
        autoScrollEnabled
      />
    )

    fireEvent.press(screen.getByText('Envie de lire'))

    expect(onItemSelect).toHaveBeenNthCalledWith(1, 1)
  })

  it('should mark item as selected', () => {
    render(
      <VenueSelectionList
        onItemSelect={jest.fn()}
        selectedItem={1}
        items={items}
        nbLoadedHits={nbLoadedHits}
        nbHits={nbHits}
        isFetchingNextPage
        autoScrollEnabled
      />
    )

    expect(screen.queryAllByTestId('venue-selection-list-item')[0]).toHaveStyle({
      borderWidth: 2,
      borderColor: theme.colors.black,
    })
  })

  it('should display distance when user share his position', () => {
    render(
      <VenueSelectionList
        onItemSelect={jest.fn()}
        selectedItem={1}
        items={items}
        nbLoadedHits={nbLoadedHits}
        nbHits={nbHits}
        isFetchingNextPage
        autoScrollEnabled
        isSharingLocation
      />
    )

    expect(screen.getByText('À 500 m')).toBeTruthy()
  })

  it('should not display distance when user not share his position', () => {
    render(
      <VenueSelectionList
        onItemSelect={jest.fn()}
        selectedItem={1}
        items={items}
        nbLoadedHits={nbLoadedHits}
        nbHits={nbHits}
        isFetchingNextPage
        autoScrollEnabled
      />
    )

    expect(screen.queryByText('À 500 m')).toBeNull()
  })
})
