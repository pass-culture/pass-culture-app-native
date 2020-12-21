import { render } from '@testing-library/react-native'
import React from 'react'

import { CallToAction } from '../CallToAction'

describe('<CallToAction />', () => {
  it('should render', () => {
    const { toJSON } = render(<CallToAction />)
    expect(toJSON()).toMatchSnapshot()
  })
})
