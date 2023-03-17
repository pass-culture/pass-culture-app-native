import mockdate from 'mockdate'
import React from 'react'

import { CURRENT_DATE } from 'features/auth/fixtures/fixtures'
import { fireEvent, render, screen } from 'tests/utils/web'

import { SetBirthday } from './SetBirthday'

const props = { goToNextStep: jest.fn(), signUp: jest.fn() }

jest.mock('features/auth/context/SettingsContext')

describe('<SetBirthday />', () => {
  beforeEach(() => {
    mockdate.set(CURRENT_DATE)
  })

  describe('submit button behavior', () => {
    it('should be disabled the button by default', () => {
      render(<SetBirthday {...props} />)

      const continueButton = screen.getByTestId('Continuer')
      expect(continueButton).toBeDisabled()
    })

    it('should be enabled the button when the date is valid', () => {
      render(<SetBirthday {...props} />)
      fireEvent.change(screen.getByTestId('select-Jour'), { target: { value: '1' } })
      fireEvent.change(screen.getByTestId('select-Mois'), { target: { value: 'Janvier' } })
      fireEvent.change(screen.getByTestId('select-Année'), { target: { value: '2004' } })

      const continueButton = screen.getByText('Continuer')
      expect(continueButton).toBeEnabled()
    })
  })

  describe('touch device', () => {
    it('should render correctly', () => {
      // FIXME(PC-211174): This warning comes from react-native-date-picker (https://passculture.atlassian.net/browse/PC-21174)
      jest.spyOn(global.console, 'warn').mockImplementationOnce(() => null)

      const renderAPI = render(<SetBirthday {...props} />, { theme: { isTouch: true } })
      expect(renderAPI).toMatchSnapshot()
    })
  })

  describe('no touch device', () => {
    it('should render correctly', () => {
      const renderAPI = render(<SetBirthday {...props} />, { theme: { isTouch: false } })
      expect(renderAPI).toMatchSnapshot()
    })
  })
})
