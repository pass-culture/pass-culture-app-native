import React from 'react'

import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { remoteIllustrationUrls } from 'shared/illustrations/remoteIllustrations'
import { render, screen } from 'tests/utils'
import { PhonePending } from 'ui/svg/icons/PhonePending'
import { Typo } from 'ui/theme'

import { GenericErrorPage } from './GenericErrorPage'

jest.mock('libs/firebase/analytics/analytics')

// We unmock these modules to make sure they are not used because
// navigation with @react-navigation is not always defined in GenericErrorPage
jest.unmock('@react-navigation/native')
jest.unmock('@react-navigation/native-stack')
jest.unmock('@react-navigation/bottom-tabs')
jest.unmock('features/navigation/useGoBack')

describe('<GenericErrorPage />', () => {
  beforeEach(() => setFeatureFlags())

  it('should render correctly', () => {
    render(
      <GenericErrorPage
        helmetTitle="HelmetTitle"
        illustration={PhonePending}
        title="GenericErrorPage"
        subtitle="Subtitle"
        buttonPrimary={{ wording: 'Primary button', onPress: jest.fn() }}
        buttonTertiary={{ wording: 'Tertiary button', onPress: jest.fn() }}>
        <Typo.Body>Children...</Typo.Body>
      </GenericErrorPage>
    )

    expect(screen).toMatchSnapshot()
  })

  it('should display remote illustration when defined', () => {
    render(
      <GenericErrorPage
        helmetTitle="HelmetTitle"
        illustration={PhonePending}
        remoteIllustration={{
          url: remoteIllustrationUrls.mobileDeviceAndParameters,
          backgroundColor: 'pending01',
        }}
        title="GenericErrorPage"
        subtitle="Subtitle"
        buttonPrimary={{ wording: 'Primary button', onPress: jest.fn() }}
        buttonTertiary={{ wording: 'Tertiary button', onPress: jest.fn() }}>
        <Typo.Body>Children...</Typo.Body>
      </GenericErrorPage>
    )

    expect(screen.getByTestId('remote-illustration')).toBeOnTheScreen()
  })
})
