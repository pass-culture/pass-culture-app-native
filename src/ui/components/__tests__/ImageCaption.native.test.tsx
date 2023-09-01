import React from 'react'

import { render } from 'tests/utils'

import { ImageCaption } from '../ImageCaption'

const props = {
  categoryLabel: 'Musique',
  distance: '1,2km',
  height: 20,
  width: 50,
}

describe('ImageCaption component', () => {
  afterAll(() => jest.resetAllMocks())

  it('should render correctly', () => {
    const { toJSON, queryByTestId } = render(<ImageCaption {...props} />)
    expect(toJSON()).toMatchSnapshot()
    expect(queryByTestId('distanceImageCaption')).toBeOnTheScreen()
  })

  it('should not display the distance if not available', () => {
    const { queryByTestId } = render(<ImageCaption {...props} distance={undefined} />)
    expect(queryByTestId('distanceImageCaption')).toBeNull()
  })
})
