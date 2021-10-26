import React from 'react'

import { render } from 'tests/utils/web'

import { ChangeEmail } from '../ChangeEmail'

jest.mock('react-query')

describe('<ChangeEmail/>', () => {
  it('should render correctly', () => {
    const renderAPI = render(<ChangeEmail />)
    expect(renderAPI).toMatchSnapshot()
  })
})
