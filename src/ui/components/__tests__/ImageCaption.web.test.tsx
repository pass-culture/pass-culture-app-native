import React from 'react'

import { render, screen } from 'tests/utils/web'

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
    const renderAPI = render(<ImageCaption {...props} />)
    expect(renderAPI).toMatchSnapshot()
    expect(screen.queryByTestId('distanceImageCaption')).toBeTruthy()
  })

  it('should not display the distance if not available', () => {
    render(<ImageCaption {...props} distance={undefined} />)
    expect(screen.queryByTestId('distanceImageCaption')).toBeNull()
  })
})
