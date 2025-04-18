import React from 'react'

import { dispatch } from '__mocks__/@react-navigation/native'
import * as API from 'api/api'
import { ApiError } from 'api/ApiError'
import { UserProfileResponse } from 'api/gen'
import { initialSubscriptionState } from 'features/identityCheck/context/reducer'
import * as SubscriptionContextProvider from 'features/identityCheck/context/SubscriptionContextProvider'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render, screen, userEvent } from 'tests/utils'

import { SetPhoneNumberWithoutValidation } from './SetPhoneNumberWithoutValidation'

jest.mock('libs/jwt/jwt')

const patchProfile = jest.spyOn(API.api, 'patchNativeV1Profile')

const mockDispatch = jest.fn()
const mockUseSubscriptionContext = jest.spyOn(SubscriptionContextProvider, 'useSubscriptionContext')

const user = userEvent.setup()
jest.useFakeTimers()

describe('SetPhoneNumberWithoutValidation', () => {
  beforeEach(() => {
    setStoreInitialState()
  })

  it('should match snapshot', () => {
    renderSetPhoneNumberWithoutValidation()

    expect(screen).toMatchSnapshot()
  })

  describe('when form validation', () => {
    it('should disable the button when phone number is invalid', async () => {
      givenStoredPhoneNumber('', { callingCode: '33', countryCode: 'FR' })

      const { unmount } = renderSetPhoneNumberWithoutValidation()

      await fillPhoneNumberInput('123')

      const button = screen.getByText('Continuer')
      await act(() => {
        expect(button).toBeDisabled()
      })

      unmount() // to avoid act warning https://github.com/orgs/react-hook-form/discussions/3108#discussioncomment-8514714
    })

    it('should enable the button when phone number is valid', async () => {
      givenStoredPhoneNumber('', { callingCode: '33', countryCode: 'FR' })

      const { unmount } = renderSetPhoneNumberWithoutValidation()

      await fillPhoneNumberInput('0612345678')

      const button = screen.getByText('Continuer')
      await act(() => {
        expect(button).toBeEnabled()
      })

      unmount()
    })
  })

  describe('when user already given his phone number', () => {
    it('should use the phone number already given', () => {
      givenStoredPhoneNumber('0612345678', { callingCode: '33', countryCode: 'FR' })

      const { unmount } = renderSetPhoneNumberWithoutValidation()

      expect(screen.getByTestId('Entrée pour le numéro de téléphone').props.value).toBe(
        '0612345678'
      )

      unmount()
    })

    it('should use the country already given', () => {
      givenStoredPhoneNumber('0612345678', { callingCode: '596', countryCode: 'MQ' })

      const { unmount } = renderSetPhoneNumberWithoutValidation()

      const countrySelected = screen.getByText('+596')

      expect(countrySelected).toBeOnTheScreen()

      unmount()
    })
  })

  describe('when user submits the form', () => {
    describe('When success', () => {
      beforeEach(() => {
        updatePhoneNumberWillSucceed()
      })

      it('should redirect to steppers when update phone number is succeed', async () => {
        const { unmount } = renderSetPhoneNumberWithoutValidation()

        await submitWithPhoneNumber('0612345678')

        await act(() => {
          expect(dispatch).toHaveBeenCalledWith({
            payload: { index: 1, routes: [{ name: 'TabNavigator' }, { name: 'Stepper' }] },
            type: 'RESET',
          })
        })

        unmount()
      })

      it('should store phone number', async () => {
        const { unmount } = renderSetPhoneNumberWithoutValidation()

        await submitWithPhoneNumber('0612345678')

        expect(mockDispatch).toHaveBeenCalledWith({
          payload: {
            country: { callingCode: '33', countryCode: 'FR' },
            phoneNumber: '0612345678',
          },
          type: 'SET_PHONE_NUMBER',
        })

        unmount()
      })
    })

    describe('When failure', () => {
      it('should show error message when update phone number is failed', async () => {
        updatePhoneNumberWillFail()
        const { unmount } = renderSetPhoneNumberWithoutValidation()

        await submitWithPhoneNumber('0612345678')

        expect(await screen.findByText('Une erreur est survenue')).toBeTruthy()

        unmount()
      })
    })
  })

  function renderSetPhoneNumberWithoutValidation() {
    return render(reactQueryProviderHOC(<SetPhoneNumberWithoutValidation />))
  }

  function updatePhoneNumberWillSucceed() {
    patchProfile.mockResolvedValueOnce({} as UserProfileResponse)
  }

  function updatePhoneNumberWillFail() {
    patchProfile.mockRejectedValueOnce(new ApiError(500, undefined, 'Une erreur est survenue'))
  }

  async function fillPhoneNumberInput(phoneNumber: string) {
    await act(() => {
      const input = screen.getByTestId('Entrée pour le numéro de téléphone')
      fireEvent.changeText(input, phoneNumber)
    })
  }

  async function submitWithPhoneNumber(phoneNumber: string) {
    await fillPhoneNumberInput(phoneNumber)

    await user.press(screen.getByText('Continuer'))
  }

  function givenStoredPhoneNumber(
    phoneNumber: string,
    country: { callingCode: string; countryCode: string }
  ) {
    mockUseSubscriptionContext.mockReturnValue({
      dispatch: mockDispatch,
      ...initialSubscriptionState,
      phoneValidation: {
        phoneNumber,
        country,
      },
    })
  }

  function setStoreInitialState() {
    mockUseSubscriptionContext.mockReturnValue({
      dispatch: mockDispatch,
      ...initialSubscriptionState,
    })
  }
})
