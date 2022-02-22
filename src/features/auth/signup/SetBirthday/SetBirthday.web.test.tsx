import mockdate from 'mockdate'
import React from 'react'

import { CURRENT_DATE } from 'features/auth/signup/SetBirthday/utils/fixtures'
import { fireEvent, render } from 'tests/utils/web'

import { SetBirthday } from './SetBirthday'

const props = { goToNextStep: jest.fn(), signUp: jest.fn() }

jest.mock('features/auth/settings')

// eslint-disable-next-line local-rules/no-allow-console
allowConsole({ warn: true })

describe('<SetBirthday />', () => {
  beforeEach(() => {
    mockdate.set(CURRENT_DATE)
  })

  describe('submit button behavior', () => {
    it('should be disabled the button by default', () => {
      const { getByTestId } = render(<SetBirthday {...props} />)

      const continueButton = getByTestId('date-picker-submit-button')
      expect(continueButton).toBeDisabled()
    })

    it('should be enabled the button when the date is valid', () => {
      const { getByTestId } = render(<SetBirthday {...props} />)

      fireEvent.change(getByTestId('select-Jour'), { target: { value: '1' } })
      fireEvent.change(getByTestId('select-Mois'), { target: { value: 'Janvier' } })
      fireEvent.change(getByTestId('select-Année'), { target: { value: '2004' } })

      const continueButton = getByTestId('date-picker-submit-button')
      expect(continueButton).toBeEnabled()
    })
  })

  describe('touch device', () => {
    it('should render correctly', () => {
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
