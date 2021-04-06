import React from 'react'

import { render } from 'tests/utils'

import CoordinatesView from './index'

describe('CoordinatesView component', () => {
  it('should render correctly', () => {
    const coordinatesView = render(
      <CoordinatesView
        position={{
          latitude: 45,
          longitude: 25,
          altitude: 200,
          accuracy: 1,
          heading: 0,
          speed: 0,
          altitudeAccuracy: 1,
        }}
      />
    )
    expect(coordinatesView).toMatchSnapshot()
  })
})
