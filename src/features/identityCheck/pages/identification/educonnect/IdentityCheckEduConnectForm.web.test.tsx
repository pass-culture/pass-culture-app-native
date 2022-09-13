import { rest } from 'msw'
import React from 'react'

import { server } from 'tests/server'
import { render, superFlushWithAct } from 'tests/utils/web'

import { IdentityCheckEduConnectForm } from './IdentityCheckEduConnectForm'

jest.mock('features/identityCheck/context/IdentityCheckContextProvider')
jest.mock('libs/eduConnectClient')

server.use(
  rest.get('https://login/?redirect=false', async (req, res, ctx) =>
    res(ctx.status(200), ctx.json({}))
  )
)

describe('<IdentityCheckEduConnectForm />', () => {
  it('should render IdentityCheckEduConnectForm', async () => {
    const renderAPI = render(<IdentityCheckEduConnectForm />)
    superFlushWithAct()

    expect(renderAPI).toMatchSnapshot()
  })
})
