import React from 'react'

import { render, screen } from 'tests/utils'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { LayoutExpiredLink } from 'ui/components/LayoutExpiredLink'

const onResendEmail = jest.fn()
const isFetching = false
const url = 'https://passculture.zendesk.com/hc/fr/'
const contactSupport = jest.fn()

const renderResendEmailButton = () => (
  <ButtonPrimaryWhite wording="Renvoyer l’email" onPress={onResendEmail} disabled={isFetching} />
)

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

describe('<LayoutExpiredLink/>', () => {
  it('should render correctly', () => {
    render(
      <LayoutExpiredLink
        renderCustomButton={renderResendEmailButton}
        urlFAQ={url}
        contactSupport={contactSupport}
      />
    )

    expect(screen).toMatchSnapshot()
  })
})
