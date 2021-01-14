import { render } from '@testing-library/react-native'
import React from 'react'

import { SearchFilter } from '../SearchFilter'

describe('SearchFilter component', () => {
  it('should render correctly', () => {
    const { toJSON } = render(<SearchFilter />)
    expect(toJSON()).toMatchSnapshot()
  })
})
