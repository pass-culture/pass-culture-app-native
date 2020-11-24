import { render } from '@testing-library/react-native'
import React from 'react'

import { HomeBodyPlaceholder } from '../HomeBodyPlaceholder'

describe('HomeBodyPlaceholder', () => {
  it('matches snapshot', () => {
    const homeBodyPlaceholder = render(<HomeBodyPlaceholder />)
    expect(homeBodyPlaceholder).toMatchSnapshot()
  })
})
