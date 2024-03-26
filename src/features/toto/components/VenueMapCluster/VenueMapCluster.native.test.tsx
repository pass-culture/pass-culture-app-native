import React from 'react'

import {
  Coordinates,
  Properties,
  VenueMapCluster,
} from 'features/toto/components/VenueMapCluster/VenueMapCluster'
import { render, screen } from 'tests/utils'

const coordinates: Coordinates = [2.3448944091796875, 48.87136281385057]
const geometry = {
  coordinates,
  type: 'Point',
}

const properties: Properties = {
  cluster: true,
  cluster_id: 1792,
  point_count: 2,
  point_count_abbreviated: 2,
}

describe('<VenueMapCluster />', () => {
  it('should display venue map clustering', () => {
    render(<VenueMapCluster geometry={geometry} properties={properties} onPress={jest.fn()} />)

    expect(screen.getByTestId('venue-map-cluster')).toBeOnTheScreen()
  })
})
