import { render } from '@testing-library/react-native'
import React from 'react'

import { EighteenBirthday } from './EighteenBirthday'

describe('EighteenBirthday page', () => {
  it('should render eighteen birthday', () => {
    const eighteenBirthday = render(<EighteenBirthday />)
    expect(eighteenBirthday).toMatchSnapshot()
  })
})
