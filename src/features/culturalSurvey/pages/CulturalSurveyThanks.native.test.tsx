import React from 'react'

import { CulturalSurveyThanks } from 'features/culturalSurvey/pages/CulturalSurveyThanks'
import { navigateToHome } from 'features/navigation/helpers'
import { render, fireEvent, screen } from 'tests/utils'

jest.mock('features/navigation/helpers')

describe('CulturalSurveyThanksPage page', () => {
  it('should render the page with correct layout', () => {
    render(<CulturalSurveyThanks />)

    expect(screen).toMatchSnapshot()
  })

  it('should navigate to home when pressing Découvrir le catalogue', () => {
    render(<CulturalSurveyThanks />)
    const DiscoverButton = screen.getByTestId('Découvrir le catalogue')
    fireEvent.press(DiscoverButton)

    expect(navigateToHome).toHaveBeenCalledTimes(1)
  })
})
