import * as React from 'react'

import { render } from 'tests/utils'
import { PhoneFlip } from 'ui/svg/icons/PhoneFlip'

jest.unmock('react-native-svg')

describe('PhoneFlip', () => {
  it('should render component correctly', () => {
    const PhoneFlipIcon = render(<PhoneFlip />)
    expect(PhoneFlipIcon).toMatchSnapshot()
  })
})
