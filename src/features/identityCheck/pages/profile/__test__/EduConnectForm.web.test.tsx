import React from 'react'

import { render } from 'tests/utils'

import { IdentityCheckEduConnectForm } from '../IdentityCheckEduConnectForm'

jest.mock('@pass-culture/id-check')

describe('<IdentityCheckEduConnectForm />', () => {
  it('should render IdentityCheckEduConnectForm', async () => {
    const renderAPI = render(<IdentityCheckEduConnectForm />)

    expect(renderAPI).toMatchSnapshot()
  })
})
