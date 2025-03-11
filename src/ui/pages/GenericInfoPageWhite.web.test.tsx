import React from 'react'

import { checkAccessibilityFor, render } from 'tests/utils/web'
import { GenericInfoPageWhite } from 'ui/pages/GenericInfoPageWhite'
import { MaintenanceCone } from 'ui/svg/icons/MaintenanceCone'
import { PlainArrowPrevious } from 'ui/svg/icons/PlainArrowPrevious'
import { TypoDS } from 'ui/theme'

jest.mock('libs/firebase/analytics/analytics')
jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

const onPress = jest.fn()

describe('<GenericInfoPageWhite />', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(
        <GenericInfoPageWhite
          withGoBack
          withSkipAction={onPress}
          illustration={MaintenanceCone}
          title="Title"
          subtitle="Subtitle"
          buttonPrimary={{
            wording: 'ButtonPrimary',
            navigateTo: { screen: 'CheatcodesNavigationGenericPages' },
          }}
          buttonSecondary={{
            wording: 'ButtonSecondary',
            onPress: onPress,
          }}
          buttonTertiary={{
            wording: 'ButtonTertiary',
            navigateTo: { screen: 'CheatcodesNavigationGenericPages' },
            icon: PlainArrowPrevious,
          }}>
          <TypoDS.Body>Children...</TypoDS.Body>
        </GenericInfoPageWhite>
      )

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
