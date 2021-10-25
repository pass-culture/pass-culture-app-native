import React from 'react'

import { render } from 'tests/utils/web'

import { ChangeEmail } from '../ChangeEmail'

describe('<ChangeEmail/>', () => {
  it('should render correctly', () => {
    const renderAPI = render(<ChangeEmail />)
    expect(renderAPI).toMatchSnapshot()
  })
})
