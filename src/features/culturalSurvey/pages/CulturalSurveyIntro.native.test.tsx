import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { CulturalSurveyQuestionEnum } from 'api/gen'
import { CulturalSurveyIntro } from 'features/culturalSurvey/pages/CulturalSurveyIntro'
import * as useGoBack from 'features/navigation/useGoBack'
import { analytics } from 'libs/analytics/provider'
import { render, screen, userEvent, waitFor } from 'tests/utils'

const mockGoBack = jest.fn()
jest.spyOn(useGoBack, 'useGoBack').mockReturnValue({
  goBack: mockGoBack,
  canGoBack: jest.fn(() => true),
})

jest.mock('features/navigation/helpers/navigateToHome')
jest.mock('features/navigation/navigationRef')
jest.mock('features/culturalSurvey/helpers/useGetNextQuestion')
jest.mock('features/culturalSurvey/context/CulturalSurveyContextProvider')

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})
const user = userEvent.setup()
jest.useFakeTimers()

describe('CulturalSurveyIntro page', () => {
  it('should render the page with correct layout and content', () => {
    render(<CulturalSurveyIntro />)

    expect(screen).toMatchSnapshot()
  })

  it('should navigate to first page when pressing "Commencer le questionnaire" button', async () => {
    render(<CulturalSurveyIntro />)

    const StartButton = screen.getByText('Commencer le questionnaire')
    await user.press(StartButton)

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('SubscriptionStackNavigator', {
        screen: 'CulturalSurveyQuestions',
        params: {
          question: CulturalSurveyQuestionEnum.SORTIES,
        },
      })
    })
  })

  it('should log hasStartedCulturalSurvey event when pressing "Commencer le questionnaire" button', async () => {
    render(<CulturalSurveyIntro />)

    const StartButton = screen.getByText('Commencer le questionnaire')
    await user.press(StartButton)

    expect(analytics.logHasStartedCulturalSurvey).toHaveBeenCalledTimes(1)
  })

  it('should goBack when we press on the back button', async () => {
    render(<CulturalSurveyIntro />)

    const goBackButton = screen.getByText('Retour')
    await user.press(goBackButton)

    expect(mockGoBack).toHaveBeenCalledTimes(1)
  })
})
