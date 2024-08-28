import React from 'react'

import { HomepageLabelNameEnumv2 } from 'api/gen'
import { render, screen } from 'tests/utils'

import { PlaylistCardOffer } from './PlaylistCardOffer'

const props = {
  categoryLabel: HomepageLabelNameEnumv2.MUSIQUE,
  distance: '1,2km',
  date: 'Dès le 12 mars 2020',
  name: 'The fall guys',
  isDuo: false,
  price: 'Dés 15,60 €',
  thumbUrl: 'https://www.example.com/image.jpg',
  width: 100,
  height: 100,
}

describe('PlaylistCardOffer component', () => {
  it('should render distance tag when distance is provided', () => {
    render(<PlaylistCardOffer {...props} distance="100m" />)

    expect(screen.getByTestId('DistanceId')).toBeOnTheScreen()
  })

  it('should NOT render distance tag when no distance provided', () => {
    render(<PlaylistCardOffer {...props} distance={undefined} />)

    expect(screen.queryByTestId('DistanceId')).toBeNull()
  })

  it('should add prefix to distance', () => {
    render(<PlaylistCardOffer {...props} distance="100m" />)

    expect(screen.getByTestId('DistanceId')).toHaveTextContent('à 100m')
  })
})
