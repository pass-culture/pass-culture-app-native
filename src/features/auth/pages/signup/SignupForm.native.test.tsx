import { StackScreenProps } from '@react-navigation/stack'
import { rest } from 'msw'
import React from 'react'
import DeviceInfo from 'react-native-device-info'

import { navigation } from '__mocks__/@react-navigation/native'
import { api } from 'api/api'
import { AccountRequest } from 'api/gen'
import { ELIGIBLE_AGE_DATE } from 'features/auth/fixtures/fixtures'
import { mockGoBack } from 'features/navigation/__mocks__/useGoBack'
import { RootStackParamList } from 'features/navigation/RootNavigator/types'
import { analytics } from 'libs/analytics'
import { env } from 'libs/environment'
import { EmptyResponse } from 'libs/fetch'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { eventMonitoring } from 'libs/monitoring'
import { server } from 'tests/server'
import { fireEvent, render, screen, act } from 'tests/utils'

import { SignupForm } from './SignupForm'

const getModelSpy = jest.spyOn(DeviceInfo, 'getModel')
const getSystemNameSpy = jest.spyOn(DeviceInfo, 'getSystemName')

const useFeatureFlagSpy = jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(false)
const apiSignUpSpy = jest.spyOn(api, 'postnativev1account')

const defaultProps = {
  navigation,
  route: { name: 'SignupForm', key: '', params: { preventCancellation: false } },
} as unknown as StackScreenProps<RootStackParamList, 'SignupForm'>

describe('<SignupForm />', () => {
  it('should have accessibility label indicating current step and total steps', async () => {
    render(<SignupForm {...defaultProps} />)

    expect(await screen.findByLabelText('Étape 1 sur 4 en cours')).toBeTruthy()
    expect(screen.queryByLabelText('Étape 2 sur 4 à faire')).toBeTruthy()
    expect(screen.queryByLabelText('Étape 3 sur 4 à faire')).toBeTruthy()
    expect(screen.queryByLabelText('Étape 4 sur 4 à faire')).toBeTruthy()
  })

  it('should update accessibility label indicating current step and total steps when going to next step', async () => {
    render(<SignupForm {...defaultProps} />)

    fillEmailInput()
    await act(() => fireEvent.press(screen.getByTestId('Continuer vers l’étape Mot de passe')))

    expect(screen.queryByLabelText('Étape 1 sur 4 réalisée')).toBeTruthy()
    expect(screen.queryByLabelText('Étape 2 sur 4 en cours')).toBeTruthy()
    expect(screen.queryByLabelText('Étape 3 sur 4 à faire')).toBeTruthy()
    expect(screen.queryByLabelText('Étape 4 sur 4 à faire')).toBeTruthy()
  })

  it('should display quit button and open modal on click when preventCancellation route param is false', async () => {
    render(<SignupForm {...defaultProps} />)

    fireEvent.press(await screen.findByTestId('Abandonner l’inscription'))

    expect(screen.queryByText('Veux-tu abandonner l’inscription ?')).toBeTruthy()
  })

  it('should not display quit button when preventCancellation route param is true', async () => {
    const props = {
      ...defaultProps,
      route: { ...defaultProps.route, params: { preventCancellation: true } },
    }
    render(<SignupForm {...props} />)

    await screen.findByTestId('Continuer vers l’étape Mot de passe')

    const icon = screen.queryByTestId('Abandonner l’inscription')
    expect(icon).toBeNull()
  })

  it('should call goBack() when left icon is pressed from first step', async () => {
    render(<SignupForm {...defaultProps} />)

    const icon = await screen.findByTestId('Revenir en arrière')
    fireEvent.press(icon)

    expect(mockGoBack).toBeCalledTimes(1)
  })

  it('should go to previous step without calling goBack() when left icon is pressed from second step', async () => {
    render(<SignupForm {...defaultProps} />)

    fillEmailInput()
    await act(() => fireEvent.press(screen.getByTestId('Continuer vers l’étape Mot de passe')))
    fireEvent.press(screen.getByTestId('Revenir en arrière'))

    expect(mockGoBack).toBeCalledTimes(0)
  })

  it('should redirect to SignupConfirmationEmailSent on signup success', async () => {
    simulateSignupSuccess()
    render(<SignupForm {...defaultProps} />)

    fillEmailInput()
    await act(() => fireEvent.press(screen.getByTestId('Continuer vers l’étape Mot de passe')))

    await fillPasswordInput()
    await act(async () =>
      fireEvent.press(screen.getByTestId('Continuer vers l’étape Date de naissance'))
    )

    await fillBirthdayInput()
    await act(async () =>
      fireEvent.press(screen.getByTestId('Continuer vers l’étape CGU & Données'))
    )

    await act(async () => fireEvent.press(screen.getByText('Accepter et s’inscrire')))

    expect(navigation.navigate).toHaveBeenCalledWith('SignupConfirmationEmailSent', {
      email: 'email@gmail.com',
    })
  })

  describe('API', () => {
    it('should create account when clicking on AcceptCgu button with trustedDevice when feature flag is active', async () => {
      simulateSignupSuccess()
      useFeatureFlagSpy.mockReturnValueOnce(true) // mock for email step render
      useFeatureFlagSpy.mockReturnValueOnce(true) // mock for email input rerender
      useFeatureFlagSpy.mockReturnValueOnce(true) // mock for device info rerender
      useFeatureFlagSpy.mockReturnValueOnce(true) // mock for password step render
      useFeatureFlagSpy.mockReturnValueOnce(true) // mock for password input rerender
      useFeatureFlagSpy.mockReturnValueOnce(true) // mock for set birthday step render
      useFeatureFlagSpy.mockReturnValueOnce(true) // mock for set birthday input rerender
      useFeatureFlagSpy.mockReturnValueOnce(true) // mock for accept cgu step render

      getModelSpy.mockReturnValueOnce('iPhone 13')
      getSystemNameSpy.mockReturnValueOnce('iOS')

      render(<SignupForm {...defaultProps} />)

      fillEmailInput()
      await act(() => fireEvent.press(screen.getByTestId('Continuer vers l’étape Mot de passe')))

      await fillPasswordInput()
      await act(async () =>
        fireEvent.press(screen.getByTestId('Continuer vers l’étape Date de naissance'))
      )

      await fillBirthdayInput()
      await act(async () =>
        fireEvent.press(screen.getByTestId('Continuer vers l’étape CGU & Données'))
      )

      await act(async () => fireEvent.press(screen.getByText('Accepter et s’inscrire')))

      expect(apiSignUpSpy).toHaveBeenCalledWith(
        {
          email: 'email@gmail.com',
          marketingEmailSubscription: false,
          password: 'user@AZERTY123',
          birthdate: '2003-12-01',
          postalCode: '',
          token: 'dummyToken',
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
      simulateSignupSuccess()
      render(<SignupForm {...defaultProps} />)

      fillEmailInput()
      await act(() => fireEvent.press(screen.getByTestId('Continuer vers l’étape Mot de passe')))

      await fillPasswordInput()
      await act(async () =>
        fireEvent.press(screen.getByTestId('Continuer vers l’étape Date de naissance'))
      )

      await fillBirthdayInput()
      await act(async () =>
        fireEvent.press(screen.getByTestId('Continuer vers l’étape CGU & Données'))
      )

      await act(async () => fireEvent.press(screen.getByText('Accepter et s’inscrire')))

      expect(apiSignUpSpy).toHaveBeenCalledWith(
        {
          email: 'email@gmail.com',
          marketingEmailSubscription: false,
          password: 'user@AZERTY123',
          birthdate: '2003-12-01',
          postalCode: '',
          token: 'dummyToken',
          appsFlyerPlatform: 'ios',
          appsFlyerUserId: 'uniqueCustomerId',
          trustedDevice: undefined,
        },
        { credentials: 'omit' }
      )
    })

    it('should log to sentry on API error', async () => {
      server.use(
        rest.post<AccountRequest, EmptyResponse>(
          env.API_BASE_URL + '/native/v1/account',
          (_req, res, ctx) => {
            return res.once(ctx.status(400))
          }
        )
      )

      render(<SignupForm {...defaultProps} />)

      fillEmailInput()
      await act(() => fireEvent.press(screen.getByTestId('Continuer vers l’étape Mot de passe')))

      await fillPasswordInput()
      await act(async () =>
        fireEvent.press(screen.getByTestId('Continuer vers l’étape Date de naissance'))
      )

      await fillBirthdayInput()
      await act(async () =>
        fireEvent.press(screen.getByTestId('Continuer vers l’étape CGU & Données'))
      )

      await act(async () => fireEvent.press(screen.getByText('Accepter et s’inscrire')))

      expect(eventMonitoring.captureException).toHaveBeenCalledWith(
        new Error('NETWORK_REQUEST_FAILED')
      )
    })
  })

  describe('Analytics', () => {
    it('should call logCancelSignup with Email when clicking on quit signup modal on first step', async () => {
      render(<SignupForm {...defaultProps} />)

      fireEvent.press(await screen.findByTestId('Abandonner l’inscription'))
      fireEvent.press(screen.getByText('Abandonner l’inscription'))

      expect(analytics.logCancelSignup).toHaveBeenNthCalledWith(1, 'Email')
    })

    it('should call logCancelSignup with Password when clicking on quit signup modal on second step', async () => {
      render(<SignupForm {...defaultProps} />)

      fillEmailInput()
      await act(() => fireEvent.press(screen.getByTestId('Continuer vers l’étape Mot de passe')))
      fireEvent.press(screen.getByTestId('Abandonner l’inscription'))
      fireEvent.press(screen.getByText('Abandonner l’inscription'))

      expect(analytics.logCancelSignup).toHaveBeenNthCalledWith(1, 'Password')
    })

    it('should call logContinueSetEmail when clicking on next step from SetEmail', async () => {
      render(<SignupForm {...defaultProps} />)

      fillEmailInput()
      await act(() => fireEvent.press(screen.getByTestId('Continuer vers l’étape Mot de passe')))

      expect(analytics.logContinueSetEmail).toHaveBeenCalledTimes(1)
    })

    it('should call logContinueSetPassword when clicking on next step from SetPassword', async () => {
      render(<SignupForm {...defaultProps} />)

      fillEmailInput()
      await act(async () => {
        fireEvent.press(screen.getByTestId('Continuer vers l’étape Mot de passe'))
      })

      await fillPasswordInput()
      await act(async () =>
        fireEvent.press(screen.getByTestId('Continuer vers l’étape Date de naissance'))
      )

      expect(analytics.logContinueSetPassword).toHaveBeenCalledTimes(1)
    })

    it('should call logContinueSetEmail twice if user goes back to SetEmail and clicks on next step again', async () => {
      render(<SignupForm {...defaultProps} />)

      fillEmailInput()
      await act(async () => {
        fireEvent.press(screen.getByTestId('Continuer vers l’étape Mot de passe'))
        fireEvent.press(screen.getByTestId('Revenir en arrière'))
        fireEvent.press(screen.getByTestId('Continuer vers l’étape Mot de passe'))
      })

      expect(analytics.logContinueSetEmail).toHaveBeenCalledTimes(2)
      expect(analytics.logContinueSetPassword).not.toHaveBeenCalled()
    })

    it('should call logContinueSetBirthday when clicking on next step from SetBirthday', async () => {
      render(<SignupForm {...defaultProps} />)

      fillEmailInput()
      await act(() => fireEvent.press(screen.getByTestId('Continuer vers l’étape Mot de passe')))

      await fillPasswordInput()
      await act(() =>
        fireEvent.press(screen.getByTestId('Continuer vers l’étape Date de naissance'))
      )

      await fillBirthdayInput()
      await act(async () =>
        fireEvent.press(screen.getByTestId('Continuer vers l’étape CGU & Données'))
      )

      expect(analytics.logContinueSetEmail).toHaveBeenCalledTimes(1)
      expect(analytics.logContinueSetPassword).toHaveBeenCalledTimes(1)
      expect(analytics.logContinueSetBirthday).toHaveBeenCalledTimes(1)
    })

    it('should log analytics when clicking on close icon', async () => {
      render(<SignupForm {...defaultProps} />)

      fireEvent.press(await screen.findByTestId('Abandonner l’inscription'))

      expect(analytics.logQuitSignup).toHaveBeenNthCalledWith(1, 'SetEmail')
    })
  })
})

const fillEmailInput = () => {
  const emailInput = screen.getByPlaceholderText('tonadresse@email.com')
  fireEvent.changeText(emailInput, 'email@gmail.com')
}

const fillPasswordInput = async () => {
  const passwordInput = screen.getByPlaceholderText('Ton mot de passe')
  await act(async () => fireEvent.changeText(passwordInput, 'user@AZERTY123'))
}

const fillBirthdayInput = async () => {
  const datePicker = screen.getByTestId('date-picker-spinner-native')
  await act(async () =>
    fireEvent(datePicker, 'onChange', { nativeEvent: { timestamp: ELIGIBLE_AGE_DATE } })
  )
}

const simulateSignupSuccess = () =>
  server.use(
    rest.post<AccountRequest, EmptyResponse>(
      env.API_BASE_URL + '/native/v1/account',
      (_req, res, ctx) => {
        return res.once(ctx.status(200), ctx.json({}))
      }
    )
  )
