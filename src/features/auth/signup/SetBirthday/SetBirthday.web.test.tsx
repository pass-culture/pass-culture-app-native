import mockdate from 'mockdate'
import React from 'react'

import { formatDateToISOStringWithoutTime } from 'libs/parsers'
import { fireEvent, render } from 'tests/utils/web'

import { SetBirthday } from './SetBirthday'

const CURRENT_DATE = new Date('2020-01-01T00:00:00.000Z')
const ELIGIBLE_AGE_DATE = new Date('2003-01-01T00:00:00.000Z')

const props = { goToNextStep: jest.fn(), signUp: jest.fn() }

jest.mock('features/auth/settings')

// eslint-disable-next-line local-rules/no-allow-console
allowConsole({ warn: true })

describe('<SetBirthday />', () => {
  beforeEach(() => {
    mockdate.set(CURRENT_DATE)
    jest.useFakeTimers()
  })

  describe('touch device', () => {
    it('should render correctly', () => {
      const renderAPI = render(<SetBirthday {...props} />, { theme: { isTouch: true } })
      expect(renderAPI).toMatchSnapshot()
    })

    it('should keep disabled the button "Continuer" when the date is not selected', () => {
      const { getByTestId } = render(<SetBirthday {...props} />, { theme: { isTouch: true } })

      const continueButton = getByTestId('date-picker-submit-button')
      expect(continueButton).toBeDisabled()
    })

    it('should keep disabled the button "Continuer" when the date is not an eligible date', () => {
      const { container, getByTestId } = render(<SetBirthday {...props} />, {
        theme: { isTouch: true },
      })

      const day = container.getElementsByClassName('picker-scroller')[0].childNodes[0] // 01
      fireEvent.click(day)

      const month = container.getElementsByClassName('picker-scroller')[1].childNodes[0] // Janvier
      fireEvent.click(month)

      const year = container.getElementsByClassName('picker-scroller')[2].childNodes[10] // 2010
      fireEvent.click(year)

      const continueButton = getByTestId('date-picker-submit-button')
      expect(continueButton).toBeDisabled()
    })

    it('should keep enable the button "Continuer" when the date is selected and is different from the current date', () => {
      const { container, getByTestId } = render(<SetBirthday {...props} />, {
        theme: { isTouch: true },
      })

      const day = container.getElementsByClassName('picker-scroller')[0].childNodes[0] // 01
      fireEvent.click(day)

      const month = container.getElementsByClassName('picker-scroller')[1].childNodes[0] // Janvier
      fireEvent.click(month)

      const year = container.getElementsByClassName('picker-scroller')[2].childNodes[4] // 2004
      fireEvent.click(year)

      const continueButton = getByTestId('date-picker-submit-button')
      expect(continueButton).toBeEnabled()
    })

    it('should call goToNextStep() when the date is selected and press the button "Continuer"', () => {
      const { getByTestId, container } = render(<SetBirthday {...props} />, {
        theme: { isTouch: true },
      })

      const day = container.getElementsByClassName('picker-scroller')[0].childNodes[0] // 01
      fireEvent.click(day)

      const month = container.getElementsByClassName('picker-scroller')[1].childNodes[0] // Janvier
      fireEvent.click(month)

      const year = container.getElementsByClassName('picker-scroller')[2].childNodes[3] // 2003
      fireEvent.click(year)

      const continueButton = getByTestId('date-picker-submit-button')
      fireEvent.click(continueButton)

      expect(props.goToNextStep).toBeCalledWith({
        birthdate: formatDateToISOStringWithoutTime(ELIGIBLE_AGE_DATE),
      })
    })
  })

  describe('no touch device', () => {
    it('should render correctly', () => {
      const renderAPI = render(<SetBirthday {...props} />, { theme: { isTouch: false } })
      expect(renderAPI).toMatchSnapshot()
    })

    it('should keep disabled the button "Continuer" when the date is not selected', () => {
      const { getByTestId } = render(<SetBirthday {...props} />, { theme: { isTouch: false } })

      const continueButton = getByTestId('date-picker-submit-button')
      expect(continueButton).toBeDisabled()
    })

    it('should keep disabled the button "Continuer" when the date is undefined', () => {
      const { getByTestId } = render(<SetBirthday {...props} />, { theme: { isTouch: false } })

      fireEvent.change(getByTestId('select-Jour'), { target: { value: '' } })
      fireEvent.change(getByTestId('select-Mois'), { target: { value: '' } })
      fireEvent.change(getByTestId('select-Année'), { target: { value: '' } })

      const continueButton = getByTestId('date-picker-submit-button')
      expect(continueButton).toBeDisabled()
    })

    it('should keep disable the button "Continuer" when the date is not an eligible date', () => {
      const { getByTestId } = render(<SetBirthday {...props} />, { theme: { isTouch: false } })

      fireEvent.change(getByTestId('select-Jour'), { target: { value: '1' } })
      fireEvent.change(getByTestId('select-Mois'), { target: { value: 'Janvier' } })
      fireEvent.change(getByTestId('select-Année'), { target: { value: '2010' } })

      const continueButton = getByTestId('date-picker-submit-button')
      expect(continueButton).toBeDisabled()
    })

    it('should keep enable the button "Continuer" when the date is selected and is different from the current date', () => {
      const { getByTestId } = render(<SetBirthday {...props} />, { theme: { isTouch: false } })

      fireEvent.change(getByTestId('select-Jour'), { target: { value: '1' } })
      fireEvent.change(getByTestId('select-Mois'), { target: { value: 'Janvier' } })
      fireEvent.change(getByTestId('select-Année'), { target: { value: '1994' } })

      const continueButton = getByTestId('date-picker-submit-button')
      expect(continueButton).toBeEnabled()
    })

    it('should call goToNextStep() when the date is selected and press the button "Continuer"', () => {
      const { getByTestId } = render(<SetBirthday {...props} />, { theme: { isTouch: false } })

      fireEvent.change(getByTestId('select-Jour'), { target: { value: '1' } })
      fireEvent.change(getByTestId('select-Mois'), { target: { value: 'Janvier' } })
      fireEvent.change(getByTestId('select-Année'), { target: { value: '2003' } })

      const continueButton = getByTestId('date-picker-submit-button')
      fireEvent.click(continueButton)

      expect(props.goToNextStep).toBeCalledWith({
        birthdate: formatDateToISOStringWithoutTime(ELIGIBLE_AGE_DATE),
      })
    })
  })
})
