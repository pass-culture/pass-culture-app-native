import React from 'react'

import { render } from 'tests/utils'

import { ImageCaption } from '../ImageCaption'

const props = {
  category: 'Musique',
  distance: '1,2km',
  imageWidth: 50,
}

describe('ImageCaption component', () => {
  afterAll(() => jest.resetAllMocks())

  it('should render correctly', () => {
    const { toJSON, queryByTestId } = render(<ImageCaption {...props} />)
    expect(toJSON()).toMatchSnapshot()
    expect(queryByTestId('distanceImageCaption')).toBeTruthy()
  })

  it('should not display the distance if not available', () => {
    const { queryByTestId } = render(<ImageCaption {...props} distance={undefined} />)
    expect(queryByTestId('distanceImageCaption')).toBeNull()
  })
})
