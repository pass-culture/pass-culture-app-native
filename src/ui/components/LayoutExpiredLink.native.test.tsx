import React from 'react'

import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { render, screen } from 'tests/utils'
import { LayoutExpiredLink } from 'ui/components/LayoutExpiredLink'

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const onResendEmail = jest.fn()
const isFetching = false
const url = 'https://aide.passculture.app/hc/fr'

const renderResendEmailButton = {
  wording: 'Renvoyer l’email',
  onPress: onResendEmail,
  disabled: isFetching,
}

describe('<LayoutExpiredLink/>', () => {
  beforeEach(() => {
    setFeatureFlags()
  })

  it('should render correctly', () => {
    render(
      <LayoutExpiredLink
        customSubtitle="Custom subtitle"
        primaryButtonInformations={renderResendEmailButton}
        urlFAQ={url}
      />
    )

    expect(screen).toMatchSnapshot()
  })
})
