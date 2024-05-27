import React from 'react'
import { act } from 'react-test-renderer'

import { navigate, reset } from '__mocks__/@react-navigation/native'
import { CulturalSurveyQuestionEnum } from 'api/gen'
import { CulturalSurveyIntro } from 'features/culturalSurvey/pages/CulturalSurveyIntro'
import * as ShareAppWrapperModule from 'features/share/context/ShareAppWrapper'
import { ShareAppModalType } from 'features/share/types'
import { analytics } from 'libs/analytics'
import { storage } from 'libs/storage'
import { render, fireEvent, screen, waitFor } from 'tests/utils'

jest.mock('features/navigation/helpers/navigateToHome')
jest.mock('features/navigation/navigationRef')
jest.mock('features/culturalSurvey/helpers/useGetNextQuestion')
jest.mock('features/culturalSurvey/context/CulturalSurveyContextProvider')

const mockShowAppModal = jest.fn()
jest
  .spyOn(ShareAppWrapperModule, 'useShareAppContext')
  .mockReturnValue({ showShareAppModal: mockShowAppModal })

const SHARE_APP_MODAL_STORAGE_KEY = 'has_seen_share_app_modal'

describe('CulturalSurveyIntro page', () => {
  beforeEach(() => {
    storage.clear(SHARE_APP_MODAL_STORAGE_KEY)
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

  it('should show ShareAppModal when pressing Plus tard', async () => {
    render(<CulturalSurveyIntro />)

    const laterButton = screen.getByText('Plus tard')
    await act(() => {
      fireEvent.press(laterButton)
    })

    expect(mockShowAppModal).toHaveBeenNthCalledWith(1, ShareAppModalType.BENEFICIARY)
  })

  it('should not show ShareAppModal when ShareAppModal already shown', async () => {
    storage.saveObject(SHARE_APP_MODAL_STORAGE_KEY, true)

    render(<CulturalSurveyIntro />)
    const laterButton = screen.getByText('Plus tard')
    await act(() => {
      fireEvent.press(laterButton)
    })

    expect(mockShowAppModal).not.toHaveBeenCalled()
  })

  it('should save that ShareAppModal was shown in storage', async () => {
    render(<CulturalSurveyIntro />)
    const laterButton = screen.getByText('Plus tard')
    await act(() => {
      fireEvent.press(laterButton)
    })

    const hasSeenShareAppModal = await storage.readObject(SHARE_APP_MODAL_STORAGE_KEY)

    expect(hasSeenShareAppModal).toBe(true)
  })
})
