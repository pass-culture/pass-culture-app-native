import React from 'react'

import { render } from 'tests/utils'
import { LayoutExpiredLink } from 'ui/components/LayoutExpiredLink'

const onResendEmail = jest.fn()
const isFetching = false
const url = 'https://passculture.zendesk.com/hc/fr/'
const contactSupport = jest.fn()

describe('<LayoutExpiredLink/>', () => {
  it('should render correctly', () => {
    const renderAPI = render(
      <LayoutExpiredLink
        onResendEmail={onResendEmail}
        disabledResendEmailButton={isFetching}
        urlFAQ={url}
        contactSupport={contactSupport}
      />
    )
    expect(renderAPI).toMatchSnapshot()
  })
})
