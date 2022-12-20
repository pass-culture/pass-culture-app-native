import React from 'react'

import { CulturalSurveyThanks } from 'features/culturalSurvey/pages/CulturalSurveyThanks'
import { navigateToHome } from 'features/navigation/helpers'
import { render, fireEvent } from 'tests/utils'

jest.mock('features/navigation/helpers')
describe('CulturalSurveyThanksPage page', () => {
  it('should render the page with correct layout', () => {
    const CulturalSurveyThanksPage = render(<CulturalSurveyThanks />)
    expect(CulturalSurveyThanksPage).toMatchSnapshot()
  })

  it('should navigate to home when pressing Découvrir le catalogue', () => {
    const CulturalSurveyThanksPage = render(<CulturalSurveyThanks />)
    const DiscoverButton = CulturalSurveyThanksPage.getByTestId('Découvrir le catalogue')
    fireEvent.press(DiscoverButton)
    expect(navigateToHome).toHaveBeenCalledTimes(1)
  })
})
