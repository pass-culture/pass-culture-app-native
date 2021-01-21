import { render } from '@testing-library/react-native'
import React from 'react'

import { Radius } from '../Radius'

describe('Radius component', () => {
  it('should render initial radius range correctly', () => {
    const { queryByText } = render(<Radius />)
    expect(queryByText('100 km')).toBeTruthy()
  })
})
