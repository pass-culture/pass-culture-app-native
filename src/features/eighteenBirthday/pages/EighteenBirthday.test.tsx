import { render } from '@testing-library/react-native'
import React from 'react'

import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'

import { EighteenBirthday } from './EighteenBirthday'

describe('EighteenBirthday page', () => {
  it('should render eighteen birthday', () => {
    const eighteenBirthday = render(reactQueryProviderHOC(<EighteenBirthday />))
    expect(eighteenBirthday).toMatchSnapshot()
  })
})
