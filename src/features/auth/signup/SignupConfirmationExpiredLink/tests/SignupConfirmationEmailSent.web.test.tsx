import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import waitForExpect from 'wait-for-expect'

import { contactSupport } from 'features/auth/support.services'
import { mockGoBack } from 'features/navigation/__mocks__/useGoBack'
import { usePreviousRoute, navigateToHome } from 'features/navigation/helpers'
import { RootStackParamList } from 'features/navigation/RootNavigator'
import { analytics } from 'libs/analytics'
import { fireEvent, render } from 'tests/utils/web'

import { SignupConfirmationEmailSent } from '../../SignupConfirmationEmailSent/SignupConfirmationEmailSent'

const mockUsePreviousRoute = usePreviousRoute as jest.MockedFunction<typeof usePreviousRoute>
jest.mock('features/navigation/helpers')

describe('<SignupConfirmationEmailSent />', () => {
  beforeEach(() => {
    mockUsePreviousRoute.mockReturnValue({ name: 'SomeScreen', key: 'key' })
  })

  it('should go back when clicking on left icon of modal header', async () => {
    const { findByTestId } = renderPage()

    const leftIconButton = await findByTestId('Revenir en arrière')
    fireEvent.click(leftIconButton)

    await waitForExpect(() => {
      expect(mockGoBack).toHaveBeenCalledTimes(1)
    })
  })

  it('should NOT display back button when previous screen is AcceptCgu', async () => {
    // eslint-disable-next-line local-rules/independant-mocks
    mockUsePreviousRoute.mockReturnValue({ name: 'AcceptCgu', key: 'key' })
    const { queryByTestId } = renderPage()

    const leftIconButton = queryByTestId('Revenir en arrière')

    await waitForExpect(() => {
      expect(leftIconButton).toBeFalsy()
    })
  })

  it('should go to home page when clicking on right icon', async () => {
    const { findByTestId } = renderPage()

    const rightIconButton = await findByTestId("Abandonner l'inscription")
    fireEvent.click(rightIconButton)

    await waitForExpect(() => {
      expect(navigateToHome).toBeCalledTimes(1)
    })
  })

  it('should open faq webpage when clicking on consult help support', async () => {
    const { findByText } = renderPage()

    const consultHelpSupportButton = await findByText("Consulter notre centre d'aide")
    fireEvent.click(consultHelpSupportButton)

    await waitForExpect(() => {
      expect(analytics.logHelpCenterContactSignupConfirmationEmailSent).toBeCalledTimes(1)
      expect(contactSupport.forSignupConfirmationEmailNotReceived).toBeCalledTimes(1)
    })
  })
})

function renderPage() {
  const navigationProps = {
    route: { params: { email: 'john.doe@gmail.com' } },
  } as StackScreenProps<RootStackParamList, 'SignupConfirmationEmailSent'>
  return render(
    <SafeAreaProvider>
      <SignupConfirmationEmailSent {...navigationProps} />
    </SafeAreaProvider>
  )
}
