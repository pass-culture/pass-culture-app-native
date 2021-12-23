import React from 'react'

import { UnderageAccountCreated } from 'features/identityCheck/pages/confirmation/UnderageAccountCreated'
import { render } from 'tests/utils'

jest.mock('react-query')

describe('<UnderageAccountCreated/>', () => {
  it('should render correctly', () => {
    const renderAPI = render(<UnderageAccountCreated />)
    expect(renderAPI).toMatchSnapshot()
  })
})
