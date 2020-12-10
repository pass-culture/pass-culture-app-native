import { StackScreenProps } from '@react-navigation/stack'
import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'
import { Linking } from 'react-native'
import waitForExpect from 'wait-for-expect'

import { navigate, goBack } from '__mocks__/@react-navigation/native'
import { AuthContext } from 'features/auth/AuthContext'
import { RootStackParamList } from 'features/navigation/RootNavigator'
import { env } from 'libs/environment'

import { AcceptCgu } from './AcceptCgu'

const mockSignUp = jest.fn()

describe('AcceptCgu Page', () => {
  it('should navigate to the previous page on back navigation', () => {
    const { getByTestId } = renderAcceptCGU()
    const leftIcon = getByTestId('leftIcon')
    fireEvent.press(leftIcon)

    expect(goBack).toBeCalledTimes(1)
  })

  it('should open mail app when clicking on contact support button', async () => {
    jest.spyOn(Linking, 'canOpenURL').mockResolvedValue(true)

    const { findByText } = renderAcceptCGU()

    const contactSupportButton = await findByText('Contacter le support')
    fireEvent.press(contactSupportButton)

    await waitForExpect(() => {
      expect(Linking.openURL).toHaveBeenCalledWith('mailto:support@test.passculture.app')
    })
  })
  it('should redirect to the "CGU" page', async () => {
    jest.spyOn(Linking, 'canOpenURL').mockResolvedValue(true)

    const { findByText } = renderAcceptCGU()

    const link = await findByText("Conditions Générales d'Utilisation")
    fireEvent.press(link)

    await waitForExpect(() => {
      expect(Linking.openURL).toHaveBeenCalledWith(env.CGU_LINK)
    })
  })
  it('should redirect to the "Politique de confidentialité" page', async () => {
    jest.spyOn(Linking, 'canOpenURL').mockResolvedValue(true)

    const { findByText } = renderAcceptCGU()

    const link = await findByText('Politique de confidentialité.')
    fireEvent.press(link)

    await waitForExpect(() => {
      expect(Linking.openURL).toHaveBeenCalledWith(env.PRIVACY_POLICY_LINK)
    })
  })

  it('should call API to create user account ', async () => {
    mockSignUp.mockImplementationOnce(() => true)

    const { findByText } = renderAcceptCGU()

    const contactSupportButton = await findByText('Accepter et s’inscrire')
    fireEvent.press(contactSupportButton)

    await waitForExpect(() => {
      expect(mockSignUp).toBeCalledWith({
        birthdate: '12-2-1995',
        email: 'john.doe@example.com',
        hasAllowedRecommendations: true,
        password: 'password',
        token: 'ABCDEF',
      })
      expect(navigate).toBeCalledWith('SignupConfirmationEmailSent', {
        email: 'john.doe@example.com',
      })
    })
  })

  it('should open quit signup modal', () => {
    const { getByTestId, queryByText } = renderAcceptCGU()

    const rightIcon = getByTestId('rightIcon')
    fireEvent.press(rightIcon)

    const title = queryByText("Es-tu sûr de vouloir abandonner l'inscription ?")
    expect(title).toBeTruthy()
  })
})

function renderAcceptCGU() {
  const navigationProps = {
    route: {
      params: {
        email: 'john.doe@example.com',
        isNewsletterChecked: true,
        password: 'password',
        birthday: '12-2-1995',
      },
    },
  } as StackScreenProps<RootStackParamList, 'AcceptCgu'>
  return render(
    <AuthContext.Provider
      value={{ isLoggedIn: true, signIn: jest.fn(), signUp: mockSignUp, signOut: jest.fn() }}>
      <AcceptCgu {...navigationProps} />
    </AuthContext.Provider>
  )
}
