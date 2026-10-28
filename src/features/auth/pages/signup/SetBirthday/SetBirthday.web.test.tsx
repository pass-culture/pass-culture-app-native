import mockdate from 'mockdate'
import React from 'react'

import { CURRENT_DATE } from 'features/auth/fixtures/fixtures'
import { analytics } from 'libs/analytics/provider'
import { act, fireEvent, render, screen } from 'tests/utils/web'

import { SetBirthday } from './SetBirthday'

const props = {
  goToNextStep: jest.fn(),
  signUp: jest.fn(),
  isSSOSubscription: false,
  previousSignupData: {
    email: '',
    marketingEmailSubscription: false,
    password: '',
    birthdate: '',
  },
  accessibilityLabelForNextStep: 'Continuer',
  onDefaultEmailSignup: jest.fn(),
}

jest.mock('ui/theme/customFocusOutline/customFocusOutline')

describe('<SetBirthday />', () => {
  beforeEach(() => {
    mockdate.set(CURRENT_DATE)
  })

  it('should show the age error when returning to the default birthdate after a change', async () => {
    const ageError = /Tu dois avoir au moins 15\sans pour t’inscrire au pass Culture/
    render(<SetBirthday {...props} />, { theme: { isTouch: false } })
    await screen.findByText('Continuer')
    await act(async () => {
      fireEvent.change(screen.getByTestId('select-Année'), { target: { value: '2005' } })
    })

    await act(async () => {
      fireEvent.change(screen.getByTestId('select-Année'), { target: { value: '2006' } })
    })

    expect(screen.getByText(ageError)).toBeInTheDocument()
  })

  describe('underage analytics', () => {
    it('should log logSignUpTooYoung when selecting a birthdate of under 15', async () => {
      render(<SetBirthday {...props} />, { theme: { isTouch: false } })
      await screen.findByText('Continuer')

      await act(async () => {
        fireEvent.change(screen.getByTestId('select-Jour'), { target: { value: '2' } })
      })

      expect(analytics.logSignUpTooYoung).toHaveBeenCalledWith(13)
    })

    it('should not log when selecting a birthdate of at least 15 years old', async () => {
      render(<SetBirthday {...props} />, { theme: { isTouch: false } })
      await screen.findByText('Continuer')

      await act(async () => {
        fireEvent.change(screen.getByTestId('select-Année'), { target: { value: '2005' } })
      })

      expect(analytics.logSignUpTooYoung).not.toHaveBeenCalled()
    })
  })

  describe('submit button behavior', () => {
    it('should disable continue button when user hasnt given his birthday yet', async () => {
      render(<SetBirthday {...props} />)

      const continueButton = await screen.findByTestId('Continuer')

      expect(continueButton).toBeDisabled()
    })

    it('should enable continue button when birthdate is valid', async () => {
      render(<SetBirthday {...props} />)
      await act(async () => {
        fireEvent.change(screen.getByTestId('select-Jour'), { target: { value: '1' } })
        fireEvent.change(screen.getByTestId('select-Mois'), { target: { value: 'Janvier' } })
        fireEvent.change(screen.getByTestId('select-Année'), { target: { value: '2004' } })
      })

      const continueButton = screen.getByText('Continuer')

      expect(continueButton).toBeEnabled()
    })
  })

  describe('touch device', () => {
    it('should render correctly', async () => {
      // FIXME(PC-211174): This warning comes from react-native-date-picker (https://passculture.atlassian.net/browse/PC-21174)
      jest.spyOn(global.console, 'warn').mockImplementationOnce(() => null)

      const { container } = render(<SetBirthday {...props} />, { theme: { isTouch: true } })
      await screen.findByText('Continuer')

      expect(container).toMatchSnapshot()
    })
  })

  describe('no touch device', () => {
    it('should render correctly', async () => {
      const { container } = render(<SetBirthday {...props} />, { theme: { isTouch: false } })
      await screen.findByText('Continuer')

      expect(container).toMatchSnapshot()
    })
  })
})
