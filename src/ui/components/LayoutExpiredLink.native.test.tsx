import React from 'react'

import { render, screen } from 'tests/utils'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { LayoutExpiredLink } from 'ui/components/LayoutExpiredLink'

const onResendEmail = jest.fn()
const isFetching = false
const url = 'https://passculture.zendesk.com/hc/fr/'

const renderResendEmailButton = () => (
  <ButtonPrimaryWhite wording="Renvoyer l’email" onPress={onResendEmail} disabled={isFetching} />
)

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

describe('<LayoutExpiredLink/>', () => {
  it('should render correctly', () => {
    render(<LayoutExpiredLink renderCustomButton={renderResendEmailButton} urlFAQ={url} />)

    expect(screen).toMatchSnapshot()
  })
})
