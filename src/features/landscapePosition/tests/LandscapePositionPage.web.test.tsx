import React from 'react'

import { render } from 'tests/utils/web'

import { LandscapePositionPage } from '../LandscapePositionPage'

jest.mock('react-native-modal')

describe('<LandscapePositionPage />', () => {
  it('should match snapshot with default message', () => {
    const landscapePositionPage = render(<LandscapePositionPage isVisible />)
    expect(landscapePositionPage).toMatchSnapshot()
  })
})
