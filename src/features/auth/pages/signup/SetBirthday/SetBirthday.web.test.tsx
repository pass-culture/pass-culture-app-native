import mockdate from 'mockdate'
import React from 'react'

import { CURRENT_DATE } from 'features/auth/fixtures/fixtures'
import { fireEvent, render } from 'tests/utils/web'

import { SetBirthday } from './SetBirthday'

const props = { goToNextStep: jest.fn(), signUp: jest.fn() }

jest.mock('features/auth/context/SettingsContext')

describe('<SetBirthday />', () => {
  beforeEach(() => {
    mockdate.set(CURRENT_DATE)
  })

  describe('submit button behavior', () => {
    it('should be disabled the button by default', () => {
      const { getByTestId } = render(<SetBirthday {...props} />)

      const continueButton = getByTestId('Continuer')
      expect(continueButton).toBeDisabled()
    })

    it('should be enabled the button when the date is valid', () => {
      const { getByText, getByTestId } = render(<SetBirthday {...props} />)
      fireEvent.change(getByTestId('select-Jour'), { target: { value: '1' } })
      fireEvent.change(getByTestId('select-Mois'), { target: { value: 'Janvier' } })
      fireEvent.change(getByTestId('select-Année'), { target: { value: '2004' } })

      const continueButton = getByText('Continuer')
      expect(continueButton).toBeEnabled()
    })
  })

  describe('touch device', () => {
    it('should render correctly', () => {
      // FIXME(LucasBeneston): This warning comes from react-native-date-picker
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
