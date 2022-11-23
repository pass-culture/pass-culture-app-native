import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { CulturalSurveyQuestionEnum } from 'api/gen'
import { CulturalSurveyIntro } from 'features/culturalSurvey/pages/CulturalSurveyIntro'
import { navigateToHome } from 'features/navigation/helpers'
import { render, fireEvent } from 'tests/utils/web'

jest.mock('features/culturalSurvey/useGetNextQuestion')
jest.mock('features/navigation/helpers')
jest.mock('features/culturalSurvey/context/CulturalSurveyContextProvider')
describe('CulturalSurveyIntro page', () => {
  afterEach(jest.clearAllMocks)
  it('should render the page with correct layout', () => {
    const CulturalSurveyIntroPage = render(<CulturalSurveyIntro />)
    expect(CulturalSurveyIntroPage).toMatchSnapshot()
  })

  it('should navigate to first page when pressing Débuter le questionnaire', () => {
    const CulturalSurveyIntroPage = render(<CulturalSurveyIntro />)
    const StartButton = CulturalSurveyIntroPage.getByTestId('Débuter le questionnaire')
    fireEvent.click(StartButton)
    expect(navigate).toHaveBeenCalledWith('CulturalSurveyQuestions', {
      question: CulturalSurveyQuestionEnum.SORTIES,
    })
  })

  it('should navigate to home when pressing Plus tard', () => {
    const CulturalSurveyIntroPage = render(<CulturalSurveyIntro />)
    const LaterButton = CulturalSurveyIntroPage.getByTestId('Plus tard')
    fireEvent.click(LaterButton)
    expect(navigateToHome).toHaveBeenCalled()
  })
})
