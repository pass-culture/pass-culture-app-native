import { render } from '@testing-library/react-native'
import React from 'react'

import { SearchFilter } from './SearchFilter'

describe('<SearchFilter />', () => {
  it('should render', () => {
    const { toJSON } = render(<SearchFilter />)
    expect(toJSON()).toMatchSnapshot()
  })
})
