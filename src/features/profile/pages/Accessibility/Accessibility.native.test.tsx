import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { Accessibility } from 'features/profile/pages/Accessibility/Accessibility'
import { render, userEvent, screen } from 'tests/utils'

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

  it.each`
    route                         | title
    ${'AccessibilityActionPlan'}  | ${'Schéma pluriannuel'}
    ${'AccessibilityDeclaration'} | ${'Déclaration d’accessibilité'}
    ${'AccessibilityEngagement'}  | ${'Les engagements du pass Culture'}
    ${'RecommendedPaths'}         | ${'Parcours recommandés'}
  `('should navigate to $route when $title is clicked', async ({ route, title }) => {
    render(<Accessibility />)

    const row = screen.getByText(title)
    await user.press(row)

    expect(navigate).toHaveBeenCalledWith(route, undefined)
  })
})
