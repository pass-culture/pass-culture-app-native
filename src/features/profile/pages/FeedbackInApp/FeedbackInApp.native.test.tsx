import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import * as API from 'api/api'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render, screen, userEvent, waitFor } from 'tests/utils'
import { SNACK_BAR_TIME_OUT } from 'ui/components/snackBar/SnackBarContext'

import { FeedbackInApp } from './FeedbackInApp'

jest.mock('libs/jwt/jwt')
jest.mock('features/auth/context/AuthContext')

jest.mock('libs/firebase/analytics/analytics')

const mockShowSuccessSnackBar = jest.fn()
const mockShowErrorSnackBar = jest.fn()
jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: () => ({
    showSuccessSnackBar: mockShowSuccessSnackBar,
    showErrorSnackBar: mockShowErrorSnackBar,
  }),
}))

const postFeedbackSpy = jest.spyOn(API.api, 'postNativeV1Feedback')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const user = userEvent.setup()
jest.useFakeTimers()

describe('<FeedbackInApp/>', () => {
  it('should match snapshot', () => {
    renderFeedBackInApp()

    expect(screen).toMatchSnapshot()
  })

  it('should call postNativeV1Feedback when form is submitted', async () => {
    serverRespondWithSuccess()
    renderFeedBackInApp()

    await submitWithFeedback('My feedback')

    expect(postFeedbackSpy).toHaveBeenCalledWith({ feedback: 'My feedback' })
  })

  it('should NOT submit form when user feedback length is more than limit', async () => {
    serverRespondWithSuccess()
    renderFeedBackInApp()

    await submitWithFeedback('a'.repeat(801))

    expect(postFeedbackSpy).not.toHaveBeenCalled()
  })

  describe('OnSuccess', () => {
    it('should navigate to profile', async () => {
      serverRespondWithSuccess()
      renderFeedBackInApp()

      await submitWithFeedback('My feedback')

      await waitFor(async () => {
        expect(navigate).toHaveBeenCalledWith('TabNavigator', {
          screen: 'Profile',
        })
      })
    })

    it('should show success snackbar', async () => {
      serverRespondWithSuccess()

      renderFeedBackInApp()

      await submitWithFeedback('My feedback')

      expect(mockShowSuccessSnackBar).toHaveBeenCalledWith({
        message: 'Ta suggestion a bien été transmise\u00a0!',
        timeout: SNACK_BAR_TIME_OUT,
      })
    })
  })

  describe('OnError', () => {
    it('should show error snackbar', async () => {
      serverRespondWithError()
      renderFeedBackInApp()

      await submitWithFeedback('My feedback')

      expect(mockShowErrorSnackBar).toHaveBeenCalledWith({
        message: 'Une erreur s’est produite lors de l’envoi de ta suggestion. Réessaie plus tard.',
        timeout: SNACK_BAR_TIME_OUT,
      })
    })
  })

  const renderFeedBackInApp = () => {
    return render(reactQueryProviderHOC(<FeedbackInApp />))
  }

  const serverRespondWithSuccess = () => {
    mockServer.postApi('/v1/feedback', {
      responseOptions: { statusCode: 200, data: {} },
    })
  }

  const serverRespondWithError = () => {
    mockServer.postApi('/v1/feedback', {
      responseOptions: { statusCode: 400, data: {} },
    })
  }

  const submitWithFeedback = async (feedback: string) => {
    const textBox = screen.getByTestId('feedback-input')
    await act(async () => {
      fireEvent.changeText(textBox, feedback)
    })
    const submitButton = screen.getByText('Envoyer')
    await user.press(submitButton)
  }
})
