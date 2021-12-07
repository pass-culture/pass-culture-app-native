import React from 'react'

import { render } from 'tests/utils'

import { IdentityCheckEduConnectForm } from '../IdentityCheckEduConnectForm'

jest.mock('features/identityCheck/context/IdentityCheckContextProvider')
jest.mock('features/identityCheck/useIdentityCheckNavigation')
jest.mock('features/identityCheck/utils/useEduConnect')
jest.mock('@pass-culture/id-check')

describe('<IdentityCheckEduConnectForm />', () => {
  it('should render IdentityCheckEduConnectFormv', async () => {
    const renderAPI = render(<IdentityCheckEduConnectForm />)

    expect(renderAPI).toMatchSnapshot()
  })
})
