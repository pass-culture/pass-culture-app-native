import React from 'react'

import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { AccessibilityActionPlan } from 'features/profile/pages/Accessibility/AccessibilityActionPlan'
import { render, fireEvent, screen } from 'tests/utils'

const openURLSpy = jest.spyOn(NavigationHelpers, 'openUrl')

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

jest.mock('@batch.com/react-native-plugin', () =>
  jest.requireActual('__mocks__/libs/react-native-batch')
)

describe('AccessibilityActionPlan', () => {
  it('should render correctly', () => {
    render(<AccessibilityActionPlan />)

    expect(screen).toMatchSnapshot()
  })

  it.each(['https://pass.culture.fr/', 'https://passculture.app/', 'https://passculture.pro/'])(
    'should open $link when clicking help center link',
    (link) => {
      render(<AccessibilityActionPlan />)

      const linkComponents = screen.getAllByText(link)
      linkComponents.forEach((link) => {
        fireEvent.press(link)
      })

      expect(openURLSpy).toHaveBeenCalledTimes(linkComponents.length)
      expect(openURLSpy).toHaveBeenCalledWith(link, undefined, true)
    }
  )
})
