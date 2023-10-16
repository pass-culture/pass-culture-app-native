import React from 'react'

import { render, screen, superFlushWithAct } from 'tests/utils'

import { EduConnectForm } from './EduConnectForm'

jest.mock('features/identityCheck/context/SubscriptionContextProvider')
jest.mock('libs/eduConnectClient')

describe('<EduConnectForm />', () => {
  it('should render EduConnectForm', async () => {
    render(<EduConnectForm />)
    superFlushWithAct()

    expect(screen).toMatchSnapshot()
  })
})
