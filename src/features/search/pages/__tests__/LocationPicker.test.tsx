import React from 'react'

import { LocationPicker } from 'features/search/pages/LocationPicker'
import { render } from 'tests/utils'

jest.mock('react-query')

describe('<LocationPicker />', () => {
  it('should render correctly', () => {
    const renderAPI = render(<LocationPicker />)
    expect(renderAPI).toMatchSnapshot()
  })
})
