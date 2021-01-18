import { StackScreenProps } from '@react-navigation/stack'
import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'
import { Linking } from 'react-native'
import waitForExpect from 'wait-for-expect'

import { navigate, goBack } from '__mocks__/@react-navigation/native'
import { AuthContext } from 'features/auth/AuthContext'
import { RootStackParamList } from 'features/navigation/RootNavigator'
import { analytics } from 'libs/analytics'
import { env } from 'libs/environment'
import { ColorsEnum } from 'ui/theme'

import { signUp } from '../__mocks__/api'
import { useSignUp } from '../api'
import { contactSupport } from '../support.services'

import { AcceptCgu } from './AcceptCgu'

jest.mock('features/auth/api')
const mockSignUp = useSignUp as jest.Mock

describe('AcceptCgu Page', () => {
  it('should navigate to the previous page on back navigation', () => {
    const { getByTestId } = renderAcceptCGU()
    const leftIcon = getByTestId('leftIcon')
    fireEvent.press(leftIcon)

    expect(goBack).toBeCalledTimes(1)
  })

  it('should open mail app when clicking on contact support button', async () => {
    const { findByText } = renderAcceptCGU()

    const contactSupportButton = await findByText('Contacter le support')
    fireEvent.press(contactSupportButton)

    await waitForExpect(() => {
      expect(contactSupport.forGenericQuestion).toBeCalledTimes(1)
    })
  })
  it('should redirect to the "CGU" page', async () => {
    jest.spyOn(Linking, 'canOpenURL').mockResolvedValue(true)

    const { getByTestId } = renderAcceptCGU()

    const link = await getByTestId('external-link-cgu')
    fireEvent.press(link)

    await waitForExpect(() => {
      expect(Linking.openURL).toHaveBeenCalledWith(env.CGU_LINK)
    })
  })
  it('should redirect to the "Politique de confidentialité" page', async () => {
    jest.spyOn(Linking, 'canOpenURL').mockResolvedValue(true)

    const { getByTestId } = renderAcceptCGU()

    const link = await getByTestId('external-link-privacy-policy')
    fireEvent.press(link)

    await waitForExpect(() => {
      expect(Linking.openURL).toHaveBeenCalledWith(env.PRIVACY_POLICY_LINK)
    })
  })

  it('should call API to create user account ', async () => {
    mockSignUp.mockImplementationOnce(() => signUp)

    const { findByText } = renderAcceptCGU()

    const contactSupportButton = await findByText('Accepter et s’inscrire')
    fireEvent.press(contactSupportButton)

    await waitForExpect(() => {
      expect(signUp).toBeCalledWith({
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

    const title = queryByText("Veux-tu abandonner l'inscription ?")
    expect(title).toBeTruthy()
  })

  it('should display 4 step dots with the last one as current step', () => {
    const { getAllByTestId } = renderAcceptCGU()
    const dots = getAllByTestId('dot-icon')
    expect(dots.length).toBe(4)
    expect(dots[3].props.fill).toEqual(ColorsEnum.PRIMARY)
  })

  describe('<AcceptCgu /> - Analytics', () => {
    it('should log CancelSignup when clicking on "Abandonner l\'inscription"', () => {
      const { getByTestId, getByText } = renderAcceptCGU()

      const rightIcon = getByTestId('rightIcon')
      fireEvent.press(rightIcon)

      const abandonButton = getByText("Abandonner l'inscription")
      fireEvent.press(abandonButton)

      expect(analytics.logCancelSignup).toHaveBeenCalledTimes(1)
      expect(analytics.logCancelSignup).toHaveBeenCalledWith('CGU')
    })
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
      value={{
        isLoggedIn: true,
        setIsLoggedIn: jest.fn(),
      }}>
      <AcceptCgu {...navigationProps} />
    </AuthContext.Provider>
  )
}
