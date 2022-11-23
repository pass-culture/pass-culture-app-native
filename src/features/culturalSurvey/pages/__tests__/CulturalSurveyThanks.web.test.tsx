import React from 'react'

import { CulturalSurveyThanks } from 'features/culturalSurvey/pages/CulturalSurveyThanks'
import { navigateToHome } from 'features/navigation/helpers'
import { render, fireEvent } from 'tests/utils/web'

jest.mock('features/navigation/helpers')
describe('CulturalSurveyThanksPage page', () => {
  afterEach(jest.clearAllMocks)
  it('should render the page with correct layout', () => {
    const CulturalSurveyThanksPage = render(<CulturalSurveyThanks />)
    expect(CulturalSurveyThanksPage).toMatchSnapshot()
  })

  it('should navigate to home when pressing Découvrir le catalogue', () => {
    const renderAPI = render(<CulturalSurveyThanks />)
    const DiscoverButton = renderAPI.getByText('Découvrir le catalogue')
    fireEvent.click(DiscoverButton)
    expect(navigateToHome).toHaveBeenCalled()
  })
})
