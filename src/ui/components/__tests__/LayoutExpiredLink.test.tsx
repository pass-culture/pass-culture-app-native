import React from 'react'

import { render } from 'tests/utils'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { LayoutExpiredLink } from 'ui/components/LayoutExpiredLink'

const onResendEmail = jest.fn()
const isFetching = false
const url = 'https://passculture.zendesk.com/hc/fr/'
const contactSupport = jest.fn()

const renderResendEmailButton = () => (
  <ButtonPrimaryWhite wording="Renvoyer l’email" onPress={onResendEmail} disabled={isFetching} />
)

describe('<LayoutExpiredLink/>', () => {
  it('should render correctly', () => {
    const renderAPI = render(
      <LayoutExpiredLink
        renderResendEmailButton={renderResendEmailButton}
        urlFAQ={url}
        contactSupport={contactSupport}
      />
    )
    expect(renderAPI).toMatchSnapshot()
  })
})
