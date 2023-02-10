import React from 'react'

import { render, superFlushWithAct } from 'tests/utils'

import { IdentityCheckEduConnectForm } from './IdentityCheckEduConnectForm'

jest.mock('features/identityCheck/context/SubscriptionContextProvider')
jest.mock('features/identityCheck/pages/helpers/useSubscriptionNavigation')
jest.mock('libs/eduConnectClient')

describe('<IdentityCheckEduConnectForm />', () => {
  it('should render IdentityCheckEduConnectForm', async () => {
    const renderAPI = render(<IdentityCheckEduConnectForm />)
    superFlushWithAct()

    expect(renderAPI).toMatchSnapshot()
  })
})
