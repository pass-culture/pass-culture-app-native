import React from 'react'

import { fireEvent, render, screen } from 'tests/utils'
import { theme } from 'theme'

import { VenueListItem, VenueSelectionList, getVenueItemDistance } from './VenueSelectionList'

const items: VenueListItem[] = [
  {
    title: 'Envie de lire',
    address: '94200 Ivry-sur-Seine, 16 rue Gabriel Peri',
    distance: '500 m',
    offerId: 1,
    price: 1000,
  },
  {
    title: 'Le Livre Éclaire',
    address: '75013 Paris, 56 rue de Tolbiac',
    distance: '1,5 km',
    offerId: 2,
    price: 1000,
  },
  {
    title: 'Hachette Livre',
    address: '94200 Ivry-sur-Seine, Rue Charles du Colomb',
    distance: '2,4 km',
    offerId: 3,
    price: 1000,
  },
]

describe('getVenueItemDistance', () => {
  it('should return item distance when coordinates not defined', () => {
    const distance = getVenueItemDistance({ item: items[0], userPosition: null })
    expect(distance).toEqual('500 m')
  })

  it('should return distance from user when he shares his position, venue item and consulted offer coordinates defined', () => {
    const distance = getVenueItemDistance({
      item: {
        ...items[0],
        coordinates: { lat: 48.812785000877334, lng: 2.384230055167262 },
      },
      userPosition: { latitude: 48.871710682427015, longitude: 2.308210069694618 },
      offerVenueLocation: { latitude: 48.871723306924856, longitude: 2.3032157224230585 },
    })
    expect(distance).toEqual('9 km')
  })

  it('should return distance from consulted offer venue when user not share his position, venue item and consulted offer coordinates defined', () => {
    const distance = getVenueItemDistance({
      item: {
        ...items[0],
        coordinates: { lat: 48.812785000877334, lng: 2.384230055167262 },
      },
      userPosition: null,
      offerVenueLocation: { latitude: 48.84600382331077, longitude: 2.3253999109905688 },
    })
    expect(distance).toEqual('6 km')
  })
})

describe('<VenueSelectionList />', () => {
  it('should show list of items', () => {
    render(<VenueSelectionList onItemSelect={jest.fn()} items={items} />)

    expect(screen.queryAllByTestId('venue-selection-list-item')).toHaveLength(3)
  })

  it('should select item on press', () => {
    const onItemSelect = jest.fn()

    render(<VenueSelectionList onItemSelect={onItemSelect} items={items} />)

    fireEvent.press(screen.getByText('Envie de lire'))

    expect(onItemSelect).toHaveBeenNthCalledWith(1, 1)
  })

  it('should mark item as selected', () => {
    render(<VenueSelectionList onItemSelect={jest.fn()} selectedItem={1} items={items} />)

    expect(screen.queryAllByTestId('venue-selection-list-item')[0]).toHaveStyle({
      borderWidth: 2,
      borderColor: theme.colors.black,
    })
  })
})
