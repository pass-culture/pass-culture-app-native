import React from 'react'
import { act } from 'react-test-renderer'

import { navigate, reset } from '__mocks__/@react-navigation/native'
import { CulturalSurveyQuestionEnum } from 'api/gen'
import { CulturalSurveyIntro } from 'features/culturalSurvey/pages/CulturalSurveyIntro'
import { analytics } from 'libs/analytics'
import { storage } from 'libs/storage'
import { render, fireEvent, screen, waitFor } from 'tests/utils'

jest.mock('features/navigation/helpers/navigateToHome')
jest.mock('features/navigation/navigationRef')
jest.mock('features/culturalSurvey/helpers/useGetNextQuestion')
jest.mock('features/culturalSurvey/context/CulturalSurveyContextProvider')

const CULTURAL_SURVEY_DISPLAYS_STORAGE_KEY = 'times_cultural_survey_has_been_requested'

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

describe('CulturalSurveyIntro page', () => {
  beforeEach(() => {
    storage.clear(CULTURAL_SURVEY_DISPLAYS_STORAGE_KEY)
  })

  it('should render the page with correct layout', () => {
    render(<CulturalSurveyIntro />)

    expect(screen).toMatchSnapshot()
  })

  it('should navigate to first page when pressing Débuter le questionnaire', async () => {
    render(<CulturalSurveyIntro />)

    const StartButton = screen.getByText('Débuter le questionnaire')
    fireEvent.press(StartButton)

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('CulturalSurveyQuestions', {
        question: CulturalSurveyQuestionEnum.SORTIES,
      })
    })
  })

  it('should log hasStartedCulturalSurvey event when pressing Débuter le questionnaire', () => {
    render(<CulturalSurveyIntro />)

    const StartButton = screen.getByText('Débuter le questionnaire')
    fireEvent.press(StartButton)

    expect(analytics.logHasStartedCulturalSurvey).toHaveBeenCalledTimes(1)
  })

  it('should reset navigation and navigate to home when pressing Plus tard', async () => {
    render(<CulturalSurveyIntro />)

    const LaterButton = screen.getByText('Plus tard')
    fireEvent.press(LaterButton)

    await waitFor(() => {
      expect(reset).toHaveBeenCalledWith({
        index: 0,
        routes: [{ name: 'TabNavigator' }],
      })
    })
  })

  it('should log hasSkippedCulturalSurvey event when pressing Plus tard', async () => {
    render(<CulturalSurveyIntro />)

    const LaterButton = screen.getByText('Plus tard')
    await act(() => {
      fireEvent.press(LaterButton)
    })

    expect(analytics.logHasSkippedCulturalSurvey).toHaveBeenCalledTimes(1)
  })

  it('should navigate to FAQWebview when pressing En savoir plus', () => {
    render(<CulturalSurveyIntro />)

    const FAQButton = screen.getByText('En savoir plus')
    fireEvent.press(FAQButton)

    expect(navigate).toHaveBeenCalledWith('FAQWebview', undefined)
  })

  it('should increment number of times cultural survey has been seen', async () => {
    render(<CulturalSurveyIntro />)
    await screen.findByText('Plus tard')

    render(<CulturalSurveyIntro />)
    await screen.findByText('Plus tard')

    const numberOfCulturalSurveyDisplays = await storage.readObject(
      CULTURAL_SURVEY_DISPLAYS_STORAGE_KEY
    )

    expect(numberOfCulturalSurveyDisplays).toEqual(2)
  })
})
