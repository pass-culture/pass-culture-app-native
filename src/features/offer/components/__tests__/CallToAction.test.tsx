import { render } from '@testing-library/react-native'
import React from 'react'

import { CallToAction } from '../CallToAction'

describe('<CallToAction />', () => {
  it('should render', () => {
    const { toJSON, queryByText } = render(<CallToAction wording="Wording to display" />)
    expect(queryByText('Wording to display')).toBeTruthy()
    expect(toJSON()).toMatchSnapshot()
  })
})
