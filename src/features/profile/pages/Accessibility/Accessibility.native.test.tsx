import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { openUrl } from 'features/navigation/helpers/openUrl'
import { Accessibility } from 'features/profile/pages/Accessibility/Accessibility'
import { env } from 'libs/environment/fixtures'
import { render, userEvent, screen } from 'tests/utils'

jest.mock('features/navigation/helpers/openUrl')

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const user = userEvent.setup()
jest.useFakeTimers()

describe('Accessibility', () => {
  it('should render correctly', () => {
    render(<Accessibility />)

    expect(screen).toMatchSnapshot()
  })

  it('should open external link when "Schéma pluriannuel" is clicked', async () => {
    render(<Accessibility />)

    const row = screen.getByText('Schéma pluriannuel')
    await user.press(row)

    expect(openUrl).toHaveBeenNthCalledWith(1, env.ACCESSIBILITY_PLAN, undefined, true)
  })

  it('should navigate to AccessibilityEngagement when clicked', async () => {
    render(<Accessibility />)

    const row = screen.getByText('Les engagements du pass Culture')
    await user.press(row)

    expect(openUrl).toHaveBeenNthCalledWith(1, env.ACCESSIBILITY, undefined, true)
  })

  it('should navigate to AccessibilityDeclarationMobileAndroid when clicked', async () => {
    render(<Accessibility />)

    const row = screen.getByText('Déclaration d’accessibilité - Android')
    await user.press(row)

    expect(navigate).toHaveBeenCalledWith('ProfileStackNavigator', {
      params: undefined,
      screen: 'AccessibilityDeclarationMobileAndroid',
    })
  })

  it('should navigate to AccessibilityDeclarationMobileIOS when clicked', async () => {
    render(<Accessibility />)

    const row = screen.getByText('Déclaration d’accessibilité - iOS')
    await user.press(row)

    expect(navigate).toHaveBeenCalledWith('ProfileStackNavigator', {
      params: undefined,
      screen: 'AccessibilityDeclarationMobileIOS',
    })
  })

  it('should navigate to AccessibilityDeclarationWeb when clicked', async () => {
    render(<Accessibility />)

    const row = screen.getByText('Déclaration d’accessibilité - web')
    await user.press(row)

    expect(navigate).toHaveBeenCalledWith('ProfileStackNavigator', {
      params: undefined,
      screen: 'AccessibilityDeclarationWeb',
    })
  })

  it('should navigate to RecommendedPaths when clicked', async () => {
    render(<Accessibility />)

    const row = screen.getByText('Parcours recommandés - web')
    await user.press(row)

    expect(navigate).toHaveBeenCalledWith('ProfileStackNavigator', {
      params: undefined,
      screen: 'RecommendedPaths',
    })
  })
})
