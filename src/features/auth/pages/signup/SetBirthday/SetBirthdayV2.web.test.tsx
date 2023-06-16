import mockdate from 'mockdate'
import React from 'react'

import { CURRENT_DATE } from 'features/auth/fixtures/fixtures'
import { fireEvent, render, screen } from 'tests/utils/web'

import { SetBirthdayV2 } from './SetBirthdayV2'

const props = { goToNextStep: jest.fn(), signUp: jest.fn() }

jest.mock('features/auth/context/SettingsContext')

describe('<SetBirthdayV2 />', () => {
  beforeEach(() => {
    mockdate.set(CURRENT_DATE)
  })

  describe('submit button behavior', () => {
    it('should disable continue button when user hasnt given his birthday yet', () => {
      render(<SetBirthdayV2 {...props} />)

      const continueButton = screen.getByTestId('Continuer')
      expect(continueButton).toBeDisabled()
    })

    it('should enable continue button when birthdate is valid', () => {
      render(<SetBirthdayV2 {...props} />)
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

      const renderAPI = render(<SetBirthdayV2 {...props} />, { theme: { isTouch: true } })
      expect(renderAPI).toMatchSnapshot()
    })
  })

  describe('no touch device', () => {
    it('should render correctly', () => {
      const renderAPI = render(<SetBirthdayV2 {...props} />, { theme: { isTouch: false } })

      expect(renderAPI).toMatchSnapshot()
    })
  })
})
