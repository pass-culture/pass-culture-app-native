import React from 'react'

import { reset } from '__mocks__/@react-navigation/native'
import { CulturalSurveyThanks } from 'features/culturalSurvey/pages/CulturalSurveyThanks'
import { render, fireEvent, screen } from 'tests/utils'

jest.mock('features/navigation/helpers/navigateToHome')

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

describe('CulturalSurveyThanksPage page', () => {
  it('should render the page with correct layout', () => {
    render(<CulturalSurveyThanks />)

    expect(screen).toMatchSnapshot()
  })

  it('should navigate to home when pressing Découvrir le catalogue', () => {
    render(<CulturalSurveyThanks />)
    const DiscoverButton = screen.getByTestId('Découvrir le catalogue')
    fireEvent.press(DiscoverButton)

    expect(reset).toHaveBeenCalledWith({
      index: 0,
      routes: [{ name: 'TabNavigator' }],
    })
  })
})
