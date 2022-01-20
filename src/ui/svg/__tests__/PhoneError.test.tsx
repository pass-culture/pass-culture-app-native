import * as React from 'react'

import { render } from 'tests/utils'
import { PhoneFlip } from 'ui/svg/PhoneFlip'

jest.unmock('react-native-svg')

describe('PhoneError', () => {
  it('should render component correctly', () => {
    const PhoneFlipIcon = render(<PhoneFlip />)
    expect(PhoneFlipIcon).toMatchSnapshot()
  })
})
