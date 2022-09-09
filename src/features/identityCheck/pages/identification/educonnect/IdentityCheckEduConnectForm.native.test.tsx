import React from 'react'

import { render, superFlushWithAct } from 'tests/utils'

import { IdentityCheckEduConnectForm } from './IdentityCheckEduConnectForm'

jest.mock('features/identityCheck/context/IdentityCheckContextProvider')
jest.mock('features/identityCheck/useIdentityCheckNavigation')
jest.mock('libs/eduConnectClient')

describe('<IdentityCheckEduConnectForm />', () => {
  it('should render IdentityCheckEduConnectForm', async () => {
    const renderAPI = render(<IdentityCheckEduConnectForm />)
    superFlushWithAct()

    expect(renderAPI).toMatchSnapshot()
  })
})
