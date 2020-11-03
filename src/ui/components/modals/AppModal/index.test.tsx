import { render } from '@testing-library/react-native'
import React from 'react'

import AppModal from '.'

describe('AppModal component', () => {
  it('should render correctly', () => {
    const home = render(<AppModal title="Testing App Modal" visible />)
    expect(home).toMatchSnapshot()
  })
})
