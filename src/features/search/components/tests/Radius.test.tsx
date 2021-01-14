import { render } from '@testing-library/react-native'
import React from 'react'

import { Radius } from '../Radius'

describe('Radius component', () => {
  it('should render correctly', () => {
    const { toJSON, queryByText } = render(<Radius />)
    expect(toJSON()).toMatchSnapshot()
    expect(queryByText('100 km')).toBeTruthy()
  })
})
