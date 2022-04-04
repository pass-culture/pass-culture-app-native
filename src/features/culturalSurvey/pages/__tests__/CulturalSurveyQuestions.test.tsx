import React from 'react'

import { CulturalSurveyQuestions } from 'features/culturalSurvey/pages/CulturalSurveyQuestions'
import { render } from 'tests/utils'

describe('CulturalSurveysQuestions page', () => {
  it('should render the page with correct layout', () => {
    const QuestionsPage = render(<CulturalSurveyQuestions />)
    expect(QuestionsPage).toMatchSnapshot()
  })
})
