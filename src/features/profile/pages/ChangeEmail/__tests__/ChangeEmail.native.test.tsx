import React from 'react'
import { mocked } from 'ts-jest/utils'
import waitForExpect from 'wait-for-expect'

import { navigate } from '__mocks__/@react-navigation/native'
import {
  CHANGE_EMAIL_ERROR_CODE,
  useChangeEmailMutation,
  UseChangeEmailMutationProps,
} from 'features/profile/mutations'
import { analytics } from 'libs/analytics'
import { fireEvent, render } from 'tests/utils'
import { SnackBarHelperSettings } from 'ui/components/snackBar/types'
import { ColorsEnum } from 'ui/theme'

import { ChangeEmail } from '../ChangeEmail'

jest.mock('react-query')
jest.mock('features/profile/mutations')
const mockedUseChangeEmailMutation = mocked(useChangeEmailMutation)

const mockShowSuccessSnackBar = jest.fn()
const mockShowErrorSnackBar = jest.fn()
jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: () => ({
    showSuccessSnackBar: jest.fn((props: SnackBarHelperSettings) => mockShowSuccessSnackBar(props)),
    showErrorSnackBar: jest.fn((props: SnackBarHelperSettings) => mockShowErrorSnackBar(props)),
  }),
  SNACK_BAR_TIME_OUT: 5000,
}))

describe('<ChangeEmail/>', () => {
  it('should render correctly', () => {
    const renderAPI = render(<ChangeEmail />)
    expect(renderAPI.toJSON()).toMatchSnapshot()
  })

  it.each`
    password          | email                | backgroundColor          | isDisabled
    ${'password>=12'} | ${'valid@email.com'} | ${ColorsEnum.PRIMARY}    | ${false}
    ${'password>=12'} | ${'invalid@email'}   | ${ColorsEnum.GREY_LIGHT} | ${true}
    ${'password<12'}  | ${'valid@email.com'} | ${ColorsEnum.GREY_LIGHT} | ${true}
  `(
    'CTA "Enregistrer" (disabled=$isDisabled) with background color = $backgroundColor if password = "$password" and email = $email',
    async ({ password, email, backgroundColor }) => {
      const { getByPlaceholderText, getByTestId } = render(<ChangeEmail />)
      const submitButton = getByTestId('Enregistrer')
      const background = submitButton.props.style.backgroundColor
      expect(background).toEqual(ColorsEnum.GREY_LIGHT)

      const passwordInput = getByPlaceholderText('Ton mot de passe')
      const emailInput = getByPlaceholderText('tonadresse@email.com')
      fireEvent.changeText(passwordInput, password)
      fireEvent.changeText(emailInput, email)

      await waitForExpect(() => {
        const background = submitButton.props.style.backgroundColor
        expect(background).toEqual(backgroundColor)
      })
    }
  )

  it('should navigate to Profile and log event if the API call is ok', async () => {
    const { getByPlaceholderText, getByTestId } = render(<ChangeEmail />)
    const submitButton = getByTestId('Enregistrer')
    const emailInput = getByPlaceholderText('tonadresse@email.com')
    const passwordInput = getByPlaceholderText('Ton mot de passe')
    fireEvent.changeText(emailInput, 'tonadresse@email.com')
    fireEvent.changeText(passwordInput, 'password>=12')

    fireEvent.press(submitButton)

    await waitForExpect(() => {
      expect(navigate).toBeCalledWith('TabNavigator', { screen: 'Profile' })
      expect(mockShowSuccessSnackBar).toBeCalledWith({
        message:
          'E-mail envoyé ! Tu as 24h pour activer ta nouvelle adresse. Si tu ne le trouves pas, pense à vérifier tes spams.',
        timeout: 5000,
      })
      expect(analytics.logSaveNewMail).toBeCalled()
    })
  })

  it('should show error message if the user gave a wrong password', async () => {
    // @ts-ignore we don't use the other properties of UseMutationResult (such as failureCount)
    // eslint-disable-next-line local-rules/independant-mocks
    mockedUseChangeEmailMutation.mockImplementation(({ onError }: UseChangeEmailMutationProps) => ({
      mutate: () => onError({ code: CHANGE_EMAIL_ERROR_CODE.INVALID_PASSWORD }),
    }))

    const { getByPlaceholderText, getByTestId, queryByText } = render(<ChangeEmail />)
    const submitButton = getByTestId('Enregistrer')
    const emailInput = getByPlaceholderText('tonadresse@email.com')
    const passwordInput = getByPlaceholderText('Ton mot de passe')
    fireEvent.changeText(emailInput, 'tonadresse@email.com')
    fireEvent.changeText(passwordInput, 'password>=12')

    fireEvent.press(submitButton)

    await waitForExpect(() => {
      expect(navigate).not.toBeCalled()
      const errorMessage = queryByText('Mot de passe incorrect')
      expect(errorMessage).toBeTruthy()
    })

    // eslint-disable-next-line local-rules/independant-mocks
    mockedUseChangeEmailMutation.mockImplementation(
      // @ts-ignore we don't use the other properties of UseMutationResult (such as failureCount)
      ({ onSuccess }: UseChangeEmailMutationProps) => ({
        mutate: () => onSuccess(),
      })
    )
  })

  it('should show error message if the API call returns a generic error', async () => {
    // @ts-ignore we don't use the other properties of UseMutationResult (such as failureCount)
    // eslint-disable-next-line local-rules/independant-mocks
    mockedUseChangeEmailMutation.mockImplementation(({ onError }: UseChangeEmailMutationProps) => ({
      mutate: () => onError({ code: CHANGE_EMAIL_ERROR_CODE.INVALID_EMAIL }),
    }))

    const { getByPlaceholderText, getByTestId } = render(<ChangeEmail />)
    const submitButton = getByTestId('Enregistrer')
    const emailInput = getByPlaceholderText('tonadresse@email.com')
    const passwordInput = getByPlaceholderText('Ton mot de passe')
    fireEvent.changeText(emailInput, 'tonadresse@email.com')
    fireEvent.changeText(passwordInput, 'password>=12')

    fireEvent.press(submitButton)

    await waitForExpect(() => {
      expect(navigate).not.toBeCalled()
      expect(mockShowErrorSnackBar).toBeCalledWith({
        message: `Une erreur s’est produite pendant la modification de ton e-mail.
Réessaie plus tard.`,
        timeout: 5000,
      })
    })

    // eslint-disable-next-line local-rules/independant-mocks
    mockedUseChangeEmailMutation.mockImplementation(
      // @ts-ignore we don't use the other properties of UseMutationResult (such as failureCount)
      ({ onSuccess }: UseChangeEmailMutationProps) => ({
        mutate: () => onSuccess(),
      })
    )
  })
})
