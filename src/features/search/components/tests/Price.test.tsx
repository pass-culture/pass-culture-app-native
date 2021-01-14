import { render } from '@testing-library/react-native'
import React from 'react'

import { Price } from '../Price'

describe('Price component', () => {
  it('should render correctly', () => {
    const { toJSON, queryByText } = render(<Price />)
    expect(toJSON()).toMatchSnapshot()
    expect(queryByText('0 € - 300 €')).toBeTruthy()
  })
})
