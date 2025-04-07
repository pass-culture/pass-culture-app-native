import React from 'react'

import { render, screen } from 'tests/utils'
import { BicolorPhonePending } from 'ui/svg/icons/BicolorPhonePending'
import { Typo } from 'ui/theme'

import { GenericErrorPage } from './GenericErrorPage'

jest.mock('libs/firebase/analytics/analytics')

// We unmock these modules to make sure they are not used because
// navigation with @react-navigation is not always defined in GenericErrorPage
jest.unmock('@react-navigation/native')
jest.unmock('@react-navigation/stack')
jest.unmock('@react-navigation/bottom-tabs')
jest.unmock('features/navigation/useGoBack')

describe('<GenericErrorPage />', () => {
  it('should render correctly', () => {
    render(
      <GenericErrorPage
        helmetTitle="HelmetTitle"
        illustration={BicolorPhonePending}
        title="GenericErrorPage"
        subtitle="Subtitle"
        buttonPrimary={{ wording: 'Primary button', onPress: jest.fn() }}
        buttonTertiary={{ wording: 'Tertiary button', onPress: jest.fn() }}>
        <Typo.Body>Children...</Typo.Body>
      </GenericErrorPage>
    )

    expect(screen).toMatchSnapshot()
  })
})
