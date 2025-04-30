import React from 'react'

import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { render, screen, userEvent } from 'tests/utils'

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

jest.mock('libs/firebase/analytics/analytics')

const nbLoadedHits = 3
const nbHits = 40

const user = userEvent.setup()
jest.useFakeTimers()

describe('<VenueSelectionList />', () => {
  beforeEach(() => {
    setFeatureFlags()
  })

  it('should show list of items', () => {
    render(
      <VenueSelectionList
        headerMessage=""
        subTitle=""
        onItemSelect={jest.fn()}
        items={items}
        nbLoadedHits={nbLoadedHits}
        nbHits={nbHits}
        isFetchingNextPage
        autoScrollEnabled
        isSharingLocation
        onEndReached={jest.fn()}
      />
    )

    expect(screen.queryAllByTestId('venue-selection-list-item')).toHaveLength(3)
  })

  it('should select item on press', async () => {
    const onItemSelect = jest.fn()

    render(
      <VenueSelectionList
        headerMessage=""
        subTitle=""
        onItemSelect={onItemSelect}
        items={items}
        nbLoadedHits={nbLoadedHits}
        nbHits={nbHits}
        isFetchingNextPage
        autoScrollEnabled
        isSharingLocation
        onEndReached={jest.fn()}
      />
    )

    await user.press(screen.getByText('Envie de lire'))

    expect(onItemSelect).toHaveBeenNthCalledWith(1, 1)
  })

  it('should display distance when user share his position', () => {
    render(
      <VenueSelectionList
        headerMessage=""
        subTitle=""
        onItemSelect={jest.fn()}
        selectedItem={1}
        items={items}
        nbLoadedHits={nbLoadedHits}
        nbHits={nbHits}
        isFetchingNextPage
        autoScrollEnabled
        isSharingLocation
        onEndReached={jest.fn()}
      />
    )

    expect(screen.getByText('à 500 m')).toBeOnTheScreen()
  })

  it('should not display distance when user not share his position', () => {
    render(
      <VenueSelectionList
        headerMessage=""
        subTitle=""
        onItemSelect={jest.fn()}
        selectedItem={1}
        items={items}
        nbLoadedHits={nbLoadedHits}
        nbHits={nbHits}
        isFetchingNextPage
        autoScrollEnabled
        isSharingLocation={false}
        onEndReached={jest.fn()}
      />
    )

    expect(screen.queryByText('à 500 m')).not.toBeOnTheScreen()
  })
})
