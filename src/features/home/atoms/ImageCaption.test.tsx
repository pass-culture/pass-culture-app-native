import { render } from '@testing-library/react-native'
import React from 'react'

import { ImageCaption } from './ImageCaption'

let props = {
  category: 'Musique',
  distance: '1,2km',
  imageWidth: 50,
}

describe('ImageCaption component', () => {
  afterAll(() => jest.resetAllMocks())

  it('should render correctly', () => {
    const { toJSON } = render(<ImageCaption {...props} />)
    expect(toJSON()).toMatchSnapshot()
  })

  it('should have an ellipsis', () => {
    const { getByTestId, queryByTestId } = render(<ImageCaption {...props} />)
    expect(getByTestId('categoryImageCaption').parent?.props.numberOfLines).toEqual(1)
    expect(queryByTestId('distanceImageCaption')).toBeTruthy()
  })

  it('should not display the distance if not available', () => {
    const { queryByTestId } = render(<ImageCaption {...props} distance={undefined} />)
    expect(queryByTestId('distanceImageCaption')).toBeNull()
  })
})
