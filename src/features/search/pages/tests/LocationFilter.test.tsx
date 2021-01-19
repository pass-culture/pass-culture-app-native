import { render } from '@testing-library/react-native'
import React from 'react'

import { LocationFilter } from '../LocationFilter'

describe('LocationFilter component', () => {
  it('should render correctly', () => {
    const { toJSON } = render(<LocationFilter />)
    expect(toJSON()).toMatchSnapshot()
  })
})
