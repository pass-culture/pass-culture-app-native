import React from 'react'

import { render } from 'tests/utils'

import { LandscapePositionPage } from '../LandscapePositionPage'

jest.mock('react-native-modal')

describe('<LandscapePositionPage />', () => {
  it('should return null', () => {
    const renderAPI = render(<LandscapePositionPage isVisible />)
    expect(renderAPI.toJSON()).toBeNull()
  })
})
