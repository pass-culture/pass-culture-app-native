import React from 'react'

import { render, superFlushWithAct, screen } from 'tests/utils'

import { IdentityCheckEduConnectForm } from './IdentityCheckEduConnectForm'

jest.mock('features/identityCheck/context/SubscriptionContextProvider')
jest.mock('libs/eduConnectClient')

describe('<IdentityCheckEduConnectForm />', () => {
  it('should render IdentityCheckEduConnectForm', async () => {
    render(<IdentityCheckEduConnectForm />)
    superFlushWithAct()

    expect(screen).toMatchSnapshot()
  })
})
