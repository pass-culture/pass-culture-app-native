import React from 'react'

import { checkAccessibilityFor, render } from 'tests/utils/web'
import { PhonePending } from 'ui/svg/icons/PhonePending'
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
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(
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

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
