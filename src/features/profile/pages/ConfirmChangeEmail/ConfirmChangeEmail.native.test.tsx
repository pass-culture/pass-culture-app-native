import React from 'react'

import { EmailHistoryEventTypeEnum, EmailUpdateStatus } from 'api/gen'
import { ConfirmChangeEmail } from 'features/profile/pages/ConfirmChangeEmail/ConfirmChangeEmail'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'

describe('<ConfirmChangeEmail />', () => {
  it('should render correctly', () => {
    mockServer.getApi<EmailUpdateStatus>('/v1/profile/email_update/status', {
      expired: false,
      newEmail: '',
      status: EmailHistoryEventTypeEnum.UPDATE_REQUEST,
    })
    render(reactQueryProviderHOC(<ConfirmChangeEmail />))

    expect(screen).toMatchSnapshot()
  })
})
