import React from 'react'

import { render, superFlushWithAct } from 'tests/utils'

import { EduConnectForm } from './EduConnectForm'

jest.mock('features/identityCheck/context/SubscriptionContextProvider')
jest.mock('features/identityCheck/pages/helpers/useSubscriptionNavigation')
jest.mock('libs/eduConnectClient')

describe('<EduConnectForm />', () => {
  it('should render EduConnectForm', async () => {
    const renderAPI = render(<EduConnectForm />)
    superFlushWithAct()

    expect(renderAPI).toMatchSnapshot()
  })
})
