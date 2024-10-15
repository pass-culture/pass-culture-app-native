import React from 'react'

import { dispatch } from '__mocks__/@react-navigation/native'
import * as API from 'api/api'
import { UserProfileResponse } from 'api/gen'
import { initialSubscriptionState } from 'features/identityCheck/context/reducer'
import * as SubscriptionContextProvider from 'features/identityCheck/context/SubscriptionContextProvider'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render, screen, waitFor } from 'tests/utils'

import { SetPhoneNumberWithoutValidation } from './SetPhoneNumberWithoutValidation'

jest.mock('libs/jwt/jwt')
jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

const patchProfile = jest.spyOn(API.api, 'patchNativeV1Profile')

const mockDispatch = jest.fn()
const mockUseSubscriptionContext = jest.spyOn(SubscriptionContextProvider, 'useSubscriptionContext')

describe('SetPhoneNumberWithoutValidation', () => {
  beforeEach(() => {
    setStoreInitialState()
  })

  it('should match snapshot', () => {
    renderSetPhoneNumberWithoutValidation()

    expect(screen).toMatchSnapshot()
  })

  describe('when user already given his phone number', () => {
    test('Use the phone number already given', () => {
      givenStoredPhoneNumber('0612345678', { callingCode: '33', countryCode: 'FR' })

      const { unmount } = render(reactQueryProviderHOC(<SetPhoneNumberWithoutValidation />))

      expect(screen.getByTestId('Entrée pour le numéro de téléphone').props.value).toBe(
        '0612345678'
      )

      unmount() // to avoid act warning https://github.com/orgs/react-hook-form/discussions/3108#discussioncomment-8514714
    })

    test('Use the country already given', () => {
      givenStoredPhoneNumber('0612345678', { callingCode: '596', countryCode: 'MQ' })

      const { unmount } = render(reactQueryProviderHOC(<SetPhoneNumberWithoutValidation />))

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

      test('Redirect to steppers when update phone number is succeed', async () => {
        const { unmount } = render(reactQueryProviderHOC(<SetPhoneNumberWithoutValidation />))

        await submitWithPhoneNumber('0612345678')

        await waitFor(() => {
          expect(dispatch).toHaveBeenCalledWith({
            payload: { index: 1, routes: [{ name: 'TabNavigator' }, { name: 'Stepper' }] },
            type: 'RESET',
          })
        })

        unmount()
      })

      test('Store phone number', async () => {
        renderSetPhoneNumberWithoutValidation()

        await submitWithPhoneNumber('0612345678')

        await waitFor(() => {
          expect(mockDispatch).toHaveBeenCalledWith({
            payload: {
              country: { callingCode: '33', countryCode: 'FR' },
              phoneNumber: '0612345678',
            },
            type: 'SET_PHONE_NUMBER',
          })
        })
      })
    })

    describe('When failure', () => {
      test('Show error message when update phone number is failed', async () => {
        updatePhoneNumberWillFail()
        renderSetPhoneNumberWithoutValidation()

        await submitWithPhoneNumber('0612345678')

        await waitFor(() => {
          expect(screen.getByText('Une erreur est survenue')).toBeTruthy()
        })
      })
    })
  })

  test('User can NOT send form when form is invalid', async () => {
    renderSetPhoneNumberWithoutValidation()

    await fillPhoneNumberInput('')

    const button = screen.getByText('Continuer')

    expect(button).toBeDisabled()
  })

  function renderSetPhoneNumberWithoutValidation() {
    return render(reactQueryProviderHOC(<SetPhoneNumberWithoutValidation />))
  }

  function updatePhoneNumberWillSucceed() {
    patchProfile.mockResolvedValueOnce({} as UserProfileResponse)
  }

  function updatePhoneNumberWillFail() {
    patchProfile.mockRejectedValueOnce(new Error('Une erreur est survenue'))
  }

  async function fillPhoneNumberInput(phoneNumber: string) {
    await act(() => {
      const input = screen.getByTestId('Entrée pour le numéro de téléphone')
      fireEvent.changeText(input, phoneNumber)
    })
  }

  async function submitWithPhoneNumber(phoneNumber: string) {
    await fillPhoneNumberInput(phoneNumber)

    await act(() => {
      const button = screen.getByText('Continuer')
      fireEvent.press(button)
    })
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
