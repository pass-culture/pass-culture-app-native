import React from 'react'

import { checkAccessibilityFor, render } from 'tests/utils/web'
import { MaintenanceCone } from 'ui/svg/icons/MaintenanceCone'
import { PlainArrowPrevious } from 'ui/svg/icons/PlainArrowPrevious'
import { Typo } from 'ui/theme'

import { GenericInfoPage } from './GenericInfoPage'

jest.mock('libs/firebase/analytics/analytics')

const onPress = jest.fn()

describe('<GenericInfoPage />', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(
        <GenericInfoPage
          withGoBack
          withSkipAction={onPress}
          illustration={MaintenanceCone}
          title="Title"
          subtitle="Subtitle"
          buttonPrimary={{
            wording: 'ButtonPrimary',
            navigateTo: {
              screen: 'CheatcodesStackNavigator',
              params: { screen: 'CheatcodesNavigationGenericPages' },
            },
          }}
          buttonSecondary={{
            wording: 'ButtonSecondary',
            onPress: onPress,
          }}
          buttonTertiary={{
            wording: 'ButtonTertiary',
            navigateTo: {
              screen: 'CheatcodesStackNavigator',
              params: { screen: 'CheatcodesNavigationGenericPages' },
            },
            icon: PlainArrowPrevious,
          }}>
          <Typo.Body>Children...</Typo.Body>
        </GenericInfoPage>
      )

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
