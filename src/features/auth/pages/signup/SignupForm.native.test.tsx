import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'
import { View, Text } from 'react-native'
import DeviceInfo from 'react-native-device-info'

import { navigation } from '__mocks__/@react-navigation/native'
import { api } from 'api/api'
import { PreValidationSignupStepProps } from 'features/auth/types'
import { mockGoBack } from 'features/navigation/__mocks__/useGoBack'
import { RootStackParamList } from 'features/navigation/RootNavigator/types'
import { analytics } from 'libs/analytics'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { fireEvent, render, screen } from 'tests/utils'
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

jest.mock('api/api')
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

const getModelSpy = jest.spyOn(DeviceInfo, 'getModel')
const getSystemNameSpy = jest.spyOn(DeviceInfo, 'getSystemName')

const useFeatureFlagSpy = jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(false)

const defaultProps = {
  navigation,
  route: { name: 'SignupForm', key: '', params: { preventCancellation: false } },
} as unknown as StackScreenProps<RootStackParamList, 'SignupForm'>

describe('<SignupForm />', () => {
  it('should display 4 step dots with the first one as current step', async () => {
    render(<SignupForm {...defaultProps} />)

    await screen.findByTestId('goToNextStep')

    const dots = screen.getAllByTestId('dot-icon')
    expect(dots.length).toBe(4)
    expect(dots[0].props.borderColor).toEqual(theme.colors.primary)
    expect(dots[1].props.borderColor).toEqual(theme.colors.greyDark)
    expect(dots[2].props.borderColor).toEqual(theme.colors.greyDark)
    expect(dots[3].props.borderColor).toEqual(theme.colors.greyDark)
  })

  it('should display 4 step dots with the second one as current step', async () => {
    const { getAllByTestId } = render(<SignupForm {...defaultProps} />)

    fireEvent.press(await screen.findByTestId('goToNextStep'))

    const dots = getAllByTestId('dot-icon')
    expect(dots.length).toBe(4)
    expect(dots[0].props.borderColor).toEqual(theme.colors.greenValid)
    expect(dots[1].props.borderColor).toEqual(theme.colors.primary)
    expect(dots[2].props.borderColor).toEqual(theme.colors.greyDark)
    expect(dots[3].props.borderColor).toEqual(theme.colors.greyDark)
  })

  it('should open quit signup modal when preventCancellation route param is false', async () => {
    render(<SignupForm {...defaultProps} />)

    fireEvent.press(await screen.findByTestId('Abandonner l’inscription'))

    expect(screen.queryByText('Veux-tu abandonner l’inscription ?')).toBeTruthy()
  })

  it('should not open quit signup modal when preventCancellation route param is true', async () => {
    const props = {
      ...defaultProps,
      route: { ...defaultProps.route, params: { preventCancellation: true } },
    }
    render(<SignupForm {...props} />)

    await screen.findByTestId('goToNextStep')

    const icon = screen.queryByTestId('Abandonner l’inscription')
    expect(icon).toBeNull()
  })

  it('should call logCancelSignup with Email when clicking on quit signup modal on first step', async () => {
    render(<SignupForm {...defaultProps} />)

    fireEvent.press(await screen.findByTestId('Abandonner l’inscription'))
    fireEvent.press(screen.getByText('Abandonner l’inscription'))

    expect(analytics.logCancelSignup).toHaveBeenNthCalledWith(1, 'Email')
  })

  it('should call logCancelSignup with Password when clicking on quit signup modal on second step', async () => {
    render(<SignupForm {...defaultProps} />)

    fireEvent.press(await screen.findByTestId('goToNextStep'))
    fireEvent.press(screen.getByTestId('Abandonner l’inscription'))
    fireEvent.press(screen.getByText('Abandonner l’inscription'))

    expect(analytics.logCancelSignup).toHaveBeenNthCalledWith(1, 'Password')
  })

  it('should call goBack() when left icon is pressed from first step', async () => {
    render(<SignupForm {...defaultProps} />)

    const icon = await screen.findByTestId('Revenir en arrière')
    fireEvent.press(icon)

    expect(mockGoBack).toBeCalledTimes(1)
  })

  it('should go to previous step without calling goBack() when left icon is pressed from second step', async () => {
    render(<SignupForm {...defaultProps} />)

    fireEvent.press(await screen.findByTestId('goToNextStep'))
    fireEvent.press(screen.getByTestId('Revenir en arrière'))

    expect(mockGoBack).toBeCalledTimes(0)
  })

  it('should call logContinueSetEmail when clicking on next step from SetEmail', async () => {
    render(<SignupForm {...defaultProps} />)

    fireEvent.press(await screen.findByTestId('goToNextStep'))

    expect(analytics.logContinueSetEmail).toHaveBeenCalledTimes(1)
  })

  it('should call logContinueSetPassword when clicking on next step from SetPassword', async () => {
    render(<SignupForm {...defaultProps} />)

    fireEvent.press(await screen.findByTestId('goToNextStep'))

    fireEvent.press(screen.getByTestId('goToNextStep'))

    expect(analytics.logContinueSetPassword).toHaveBeenCalledTimes(1)
  })

  it('should call logContinueSetEmail twice if user goes back to SetEmail and clicks on next step again', async () => {
    render(<SignupForm {...defaultProps} />)

    fireEvent.press(await screen.findByTestId('goToNextStep'))
    fireEvent.press(screen.getByTestId('Revenir en arrière'))
    fireEvent.press(screen.getByTestId('goToNextStep'))

    expect(analytics.logContinueSetEmail).toHaveBeenCalledTimes(2)
    expect(analytics.logContinueSetPassword).not.toHaveBeenCalled()
  })

  it('should call logContinueSetBirthday when clicking on next step from SetBirthday', async () => {
    render(<SignupForm {...defaultProps} />)

    fireEvent.press(await screen.findByTestId('goToNextStep'))
    fireEvent.press(screen.getByTestId('goToNextStep'))
    fireEvent.press(screen.getByTestId('goToNextStep'))

    expect(analytics.logContinueSetEmail).toHaveBeenCalledTimes(1)
    expect(analytics.logContinueSetPassword).toHaveBeenCalledTimes(1)
    expect(analytics.logContinueSetBirthday).toHaveBeenCalledTimes(1)
  })

  it('should create account when clicking on AcceptCgu button with trustedDevice when feature flag is active', async () => {
    useFeatureFlagSpy.mockReturnValueOnce(true) // mock for email step render
    useFeatureFlagSpy.mockReturnValueOnce(true) // mock for device info rerender
    useFeatureFlagSpy.mockReturnValueOnce(true) // mock for password step render
    useFeatureFlagSpy.mockReturnValueOnce(true) // mock for set birthday step render
    useFeatureFlagSpy.mockReturnValueOnce(true) // mock for accept cgu step render

    getModelSpy.mockReturnValueOnce('iPhone 13')
    getSystemNameSpy.mockReturnValueOnce('iOS')

    render(<SignupForm {...defaultProps} />)

    fireEvent.press(await screen.findByTestId('goToNextStep'))
    fireEvent.press(screen.getByTestId('goToNextStep'))
    fireEvent.press(screen.getByTestId('goToNextStep'))
    await fireEvent.press(screen.getByTestId('signUp'))

    expect(api.postnativev1account).toHaveBeenCalledWith(
      {
        email: '',
        marketingEmailSubscription: false,
        password: '',
        birthdate: '',
        postalCode: '',
        token: 'fakeToken',
        appsFlyerPlatform: 'ios',
        appsFlyerUserId: 'uniqueCustomerId',
        trustedDevice: {
          deviceId: 'ad7b7b5a169641e27cadbdb35adad9c4ca23099a',
          os: 'iOS',
          source: 'iPhone 13',
        },
      },
      { credentials: 'omit' }
    )
  })

  it('should create account when clicking on AcceptCgu button without trustedDevice when feature flag is disabled', async () => {
    render(<SignupForm {...defaultProps} />)

    fireEvent.press(await screen.findByTestId('goToNextStep'))
    fireEvent.press(screen.getByTestId('goToNextStep'))
    fireEvent.press(screen.getByTestId('goToNextStep'))
    await fireEvent.press(screen.getByTestId('signUp'))

    expect(api.postnativev1account).toHaveBeenCalledWith(
      {
        email: '',
        marketingEmailSubscription: false,
        password: '',
        birthdate: '',
        postalCode: '',
        token: 'fakeToken',
        appsFlyerPlatform: 'ios',
        appsFlyerUserId: 'uniqueCustomerId',
        trustedDevice: undefined,
      },
      { credentials: 'omit' }
    )
  })

  it('should log analytics when clicking on close icon', async () => {
    render(<SignupForm {...defaultProps} />)

    fireEvent.press(await screen.findByTestId('Abandonner l’inscription'))

    expect(analytics.logQuitSignup).toHaveBeenNthCalledWith(1, 'SetEmail')
  })
})
