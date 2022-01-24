import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'
import { TouchableOpacity, View, Text } from 'react-native'

import { navigation } from '__mocks__/@react-navigation/native'
import { PreValidationSignupStepProps } from 'features/auth/signup/types'
import { mockGoBack } from 'features/navigation/__mocks__/useGoBack'
import { RootStackParamList } from 'features/navigation/RootNavigator'
import { analytics } from 'libs/analytics'
import { fireEvent, render } from 'tests/utils'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

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

jest.mock('./SetEmail', () => ({
  SetEmail: (props: PreValidationSignupStepProps) => mockSignupComponent('SetEmail', props),
}))
jest.mock('./SetPassword', () => ({
  SetPassword: (props: PreValidationSignupStepProps) => mockSignupComponent('SetPassword', props),
}))
jest.mock('./SetBirthday', () => ({
  SetBirthday: (props: PreValidationSignupStepProps) => mockSignupComponent('SetBirthday', props),
}))
jest.mock('./AcceptCgu', () => ({
  AcceptCgu: (props: PreValidationSignupStepProps) => mockSignupComponent('AcceptCgu', props),
}))

const defaultProps = {
  navigation,
  route: { name: 'SignupForm', key: '', params: { preventCancellation: false } },
} as StackScreenProps<RootStackParamList, 'SignupForm'>

describe('<SignupForm />', () => {
  beforeEach(jest.clearAllMocks)
  afterAll(jest.clearAllMocks)

  it('should display 4 step dots with the first one as current step', () => {
    const { getAllByTestId } = render(<SignupForm {...defaultProps} />)
    const dots = getAllByTestId('dot-icon')
    expect(dots.length).toBe(4)
    expect(dots[0].props.borderColor).toEqual(ColorsEnum.PRIMARY)
    expect(dots[1].props.borderColor).toEqual(ColorsEnum.GREY_DARK)
    expect(dots[2].props.borderColor).toEqual(ColorsEnum.GREY_DARK)
    expect(dots[3].props.borderColor).toEqual(ColorsEnum.GREY_DARK)
  })

  it('should display 4 step dots with the second one as current step', () => {
    const { getAllByTestId, getByTestId } = render(<SignupForm {...defaultProps} />)
    fireEvent.press(getByTestId('goToNextStep'))
    const dots = getAllByTestId('dot-icon')
    expect(dots.length).toBe(4)
    expect(dots[0].props.borderColor).toEqual(ColorsEnum.GREEN_VALID)
    expect(dots[1].props.borderColor).toEqual(ColorsEnum.PRIMARY)
    expect(dots[2].props.borderColor).toEqual(ColorsEnum.GREY_DARK)
    expect(dots[3].props.borderColor).toEqual(ColorsEnum.GREY_DARK)
  })

  it('should open quit signup modal when preventCancellation route param is false', () => {
    const { getByTestId, getByText } = render(<SignupForm {...defaultProps} />)
    fireEvent.press(getByTestId('rightIcon'))
    getByText("Veux-tu abandonner l'inscription\u00a0?")
  })

  it('should not open quit signup modal when preventCancellation route param is true', () => {
    const props = {
      ...defaultProps,
      route: { ...defaultProps.route, params: { preventCancellation: true } },
    }
    const { queryByTestId } = render(<SignupForm {...props} />)
    const icon = queryByTestId('rightIcon')
    expect(icon).toBeFalsy()
  })

  it('should call logCancelSignup with Email when clicking on quit signup modal on first step', () => {
    const { getByTestId, getByText } = render(<SignupForm {...defaultProps} />)
    fireEvent.press(getByTestId('rightIcon'))
    fireEvent.press(getByText("Abandonner l'inscription"))
    expect(analytics.logCancelSignup).toHaveBeenCalledTimes(1)
    expect(analytics.logCancelSignup).toHaveBeenCalledWith('Email')
  })

  it('should call logCancelSignup with Password when clicking on quit signup modal on second step', () => {
    const { getByTestId, getByText } = render(<SignupForm {...defaultProps} />)
    fireEvent.press(getByTestId('goToNextStep'))
    fireEvent.press(getByTestId('rightIcon'))
    fireEvent.press(getByText("Abandonner l'inscription"))
    expect(analytics.logCancelSignup).toHaveBeenCalledTimes(1)
    expect(analytics.logCancelSignup).toHaveBeenCalledWith('Password')
  })

  it('should call goBack() when left icon is pressed from first step', () => {
    const { getByTestId } = render(<SignupForm {...defaultProps} />)
    const icon = getByTestId('leftIcon')
    fireEvent.press(icon)
    expect(mockGoBack).toBeCalledTimes(1)
  })

  it('should go to previous step without calling goBack() when left icon is pressed from second step', () => {
    const { getByTestId, getByText } = render(<SignupForm {...defaultProps} />)
    getByText('SetEmail')
    fireEvent.press(getByTestId('goToNextStep'))
    getByText('SetPassword')
    fireEvent.press(getByTestId('leftIcon'))
    getByText('SetEmail')
    expect(mockGoBack).toBeCalledTimes(0)
  })
})
