import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'
import { View, Text } from 'react-native'

import { navigation } from '__mocks__/@react-navigation/native'
import { PreValidationSignupStepProps } from 'features/auth/types'
import { mockGoBack } from 'features/navigation/__mocks__/useGoBack'
import { RootStackParamList } from 'features/navigation/RootNavigator/types'
import { analytics } from 'libs/firebase/analytics'
import { fireEvent, render, screen, waitFor } from 'tests/utils'
import { theme } from 'theme'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'

import { SignupForm } from './SignupForm'

const mockSignupComponent = (name: string, props: PreValidationSignupStepProps) => {
  return (
    <View>
      <Text>{name}</Text>
      <TouchableOpacity testID="goToNextStep" onPress={() => props.goToNextStep({})} />
      <TouchableOpacity testID="signUp" onPress={() => props.signUp('fakeToken')} />
    </View>
  )
}

jest.mock('./SetEmail/SetEmail', () => ({
  SetEmail: (props: PreValidationSignupStepProps) => mockSignupComponent('SetEmail', props),
}))
jest.mock('./SetPassword/SetPassword', () => ({
  SetPassword: (props: PreValidationSignupStepProps) => mockSignupComponent('SetPassword', props),
}))
jest.mock('./SetBirthday/SetBirthday', () => ({
  SetBirthday: (props: PreValidationSignupStepProps) => mockSignupComponent('SetBirthday', props),
}))
jest.mock('./AcceptCgu/AcceptCgu', () => ({
  AcceptCgu: (props: PreValidationSignupStepProps) => mockSignupComponent('AcceptCgu', props),
}))

const defaultProps = {
  navigation,
  route: { name: 'SignupForm', key: '', params: { preventCancellation: false } },
} as unknown as StackScreenProps<RootStackParamList, 'SignupForm'>

describe('<SignupForm />', () => {
  it('should display 4 step dots with the first one as current step', () => {
    render(<SignupForm {...defaultProps} />)

    const dots = screen.getAllByTestId('dot-icon')
    expect(dots.length).toBe(4)
    expect(dots[0].props.borderColor).toEqual(theme.colors.primary)
    expect(dots[1].props.borderColor).toEqual(theme.colors.greyDark)
    expect(dots[2].props.borderColor).toEqual(theme.colors.greyDark)
    expect(dots[3].props.borderColor).toEqual(theme.colors.greyDark)
  })

  it('should display 4 step dots with the second one as current step', () => {
    const { getAllByTestId, getByTestId } = render(<SignupForm {...defaultProps} />)
    fireEvent.press(getByTestId('goToNextStep'))
    const dots = getAllByTestId('dot-icon')
    expect(dots.length).toBe(4)
    expect(dots[0].props.borderColor).toEqual(theme.colors.greenValid)
    expect(dots[1].props.borderColor).toEqual(theme.colors.primary)
    expect(dots[2].props.borderColor).toEqual(theme.colors.greyDark)
    expect(dots[3].props.borderColor).toEqual(theme.colors.greyDark)
  })

  it('should open quit signup modal when preventCancellation route param is false', () => {
    render(<SignupForm {...defaultProps} />)

    fireEvent.press(screen.getByTestId('Abandonner l’inscription'))

    expect(screen.queryByText('Veux-tu abandonner l’inscription ?')).toBeTruthy()
  })

  it('should not open quit signup modal when preventCancellation route param is true', () => {
    const props = {
      ...defaultProps,
      route: { ...defaultProps.route, params: { preventCancellation: true } },
    }
    render(<SignupForm {...props} />)

    const icon = screen.queryByTestId('Abandonner l’inscription')
    expect(icon).toBeFalsy()
  })

  it('should call logCancelSignup with Email when clicking on quit signup modal on first step', () => {
    render(<SignupForm {...defaultProps} />)

    fireEvent.press(screen.getByTestId('Abandonner l’inscription'))
    fireEvent.press(screen.getByText('Abandonner l’inscription'))

    expect(analytics.logCancelSignup).toHaveBeenNthCalledWith(1, 'Email')
  })

  it('should call logCancelSignup with Password when clicking on quit signup modal on second step', () => {
    render(<SignupForm {...defaultProps} />)

    fireEvent.press(screen.getByTestId('goToNextStep'))
    fireEvent.press(screen.getByTestId('Abandonner l’inscription'))
    fireEvent.press(screen.getByText('Abandonner l’inscription'))

    expect(analytics.logCancelSignup).toHaveBeenNthCalledWith(1, 'Password')
  })

  it('should call goBack() when left icon is pressed from first step', () => {
    render(<SignupForm {...defaultProps} />)

    const icon = screen.getByTestId('Revenir en arrière')
    fireEvent.press(icon)

    expect(mockGoBack).toBeCalledTimes(1)
  })

  it('should go to previous step without calling goBack() when left icon is pressed from second step', () => {
    render(<SignupForm {...defaultProps} />)

    screen.getByText('SetEmail')
    fireEvent.press(screen.getByTestId('goToNextStep'))

    screen.getByText('SetPassword')
    fireEvent.press(screen.getByTestId('Revenir en arrière'))

    screen.getByText('SetEmail')

    expect(mockGoBack).toBeCalledTimes(0)
  })

  it('should call logContinueSetEmail when clicking on next step from SetEmail', async () => {
    render(<SignupForm {...defaultProps} />)

    screen.getByText('SetEmail')
    fireEvent.press(screen.getByTestId('goToNextStep'))

    await waitFor(() => {
      expect(analytics.logContinueSetEmail).toHaveBeenCalledTimes(1)
    })
  })

  it('should call logContinueSetPassword when clicking on next step from SetPassword', async () => {
    render(<SignupForm {...defaultProps} />)

    fireEvent.press(screen.getByTestId('goToNextStep'))

    screen.getByText('SetPassword')
    fireEvent.press(screen.getByTestId('goToNextStep'))

    await waitFor(() => {
      expect(analytics.logContinueSetPassword).toHaveBeenCalledTimes(1)
    })
  })

  it('should call logContinueSetEmail twice if user goes back to SetEmail and clicks on next step again', async () => {
    render(<SignupForm {...defaultProps} />)

    fireEvent.press(screen.getByTestId('goToNextStep'))

    screen.getByText('SetPassword')
    fireEvent.press(screen.getByTestId('Revenir en arrière'))

    screen.getByText('SetEmail')
    fireEvent.press(screen.getByTestId('goToNextStep'))

    await waitFor(() => {
      expect(analytics.logContinueSetEmail).toHaveBeenCalledTimes(2)
      expect(analytics.logContinueSetPassword).not.toHaveBeenCalled()
    })
  })

  it('should call logContinueSetBirthday when clicking on next step from SetBirthday', async () => {
    render(<SignupForm {...defaultProps} />)

    fireEvent.press(screen.getByTestId('goToNextStep'))
    fireEvent.press(screen.getByTestId('goToNextStep'))

    screen.getByText('SetBirthday')
    fireEvent.press(screen.getByTestId('goToNextStep'))

    await waitFor(() => {
      expect(analytics.logContinueSetEmail).toHaveBeenCalledTimes(1)
      expect(analytics.logContinueSetPassword).toHaveBeenCalledTimes(1)
      expect(analytics.logContinueSetBirthday).toHaveBeenCalledTimes(1)
    })
  })

  it('should call logContinueCGU when clicking on AcceptCgu button', async () => {
    render(<SignupForm {...defaultProps} />)

    fireEvent.press(screen.getByTestId('goToNextStep'))
    fireEvent.press(screen.getByTestId('goToNextStep'))
    fireEvent.press(screen.getByTestId('goToNextStep'))

    screen.getByText('AcceptCgu')
    fireEvent.press(screen.getByTestId('goToNextStep'))

    await waitFor(() => {
      expect(analytics.logContinueSetEmail).toHaveBeenCalledTimes(1)
      expect(analytics.logContinueSetPassword).toHaveBeenCalledTimes(1)
      expect(analytics.logContinueSetBirthday).toHaveBeenCalledTimes(1)
      expect(analytics.logContinueCGU).toHaveBeenCalledTimes(1)
    })
  })
})
