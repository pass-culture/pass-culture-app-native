import * as React from 'react'

import { render } from 'tests/utils'
import { BicolorConfidentiality } from 'ui/svg/icons/BicolorConfidentiality'

jest.unmock('react-native-svg')

describe('BicolorConfidentiality', () => {
  it('should render component correctly', () => {
    const ConfidentialityIcon = render(<BicolorConfidentiality />)
    expect(ConfidentialityIcon).toMatchSnapshot()
  })
})
