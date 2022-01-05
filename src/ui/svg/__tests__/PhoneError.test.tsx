import * as React from 'react'

import { render } from 'tests/utils'
import { PhoneError } from 'ui/svg/PhoneError'

jest.unmock('react-native-svg')

describe('PhoneError', () => {
  it('should render component correctly', () => {
    const PhoneErrorIcon = render(<PhoneError />)
    expect(PhoneErrorIcon).toMatchSnapshot()
  })
})
