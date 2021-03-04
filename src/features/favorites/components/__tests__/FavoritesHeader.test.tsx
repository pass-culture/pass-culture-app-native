import { render } from '@testing-library/react-native'
import React from 'react'

import { FavoritesHeader } from '../FavoritesHeader'

describe('FavoritesHeader component', () => {
  it('should render favorites header', () => {
    expect(render(<FavoritesHeader />).toJSON()).toMatchSnapshot()
  })
})
