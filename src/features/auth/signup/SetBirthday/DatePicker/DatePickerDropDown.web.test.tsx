import mockdate from 'mockdate'
import React from 'react'

import { analytics } from 'libs/analytics'
import { dateDiffInFullYears } from 'libs/dates'
import { formatDateToISOStringWithoutTime } from 'libs/parsers'
import { fireEvent, render } from 'tests/utils/web'

import { DatePickerDropDown } from './DatePickerDropDown.web'

const CURRENT_DATE = new Date(`2020-12-01T00:00:00.000Z`)
const ELIGIBLE_AGE_DATE = new Date(`2003-12-01T00:00:00.000Z`)
const NOT_ELIGIBLE_YOUNGEST_AGE_DATE = new Date('2006-01-01T00:00:00.000Z')
const AGE = dateDiffInFullYears(new Date(NOT_ELIGIBLE_YOUNGEST_AGE_DATE), CURRENT_DATE)

const props = { goToNextStep: jest.fn(), signUp: jest.fn() }

// eslint-disable-next-line local-rules/no-allow-console
allowConsole({ error: true })

jest.mock('features/auth/settings')

describe('<DatePickerDropDown />', () => {
  beforeEach(() => {
    mockdate.set(CURRENT_DATE)
    jest.useFakeTimers()
  })

  describe('- navigation -', () => {
    it('should keep disabled the button "Continuer" when the date is not selected', () => {
      const { getByTestId } = render(<DatePickerDropDown {...props} />)

      const continueButton = getByTestId('date-picker-dropdown-submit-button')
      expect(continueButton).toBeDisabled()
    })

    it('should keep disabled the button "Continuer" when the date is undefined', () => {
      const { getByTestId } = render(<DatePickerDropDown {...props} />)

      fireEvent.change(getByTestId('select-Jour'), { target: { value: '' } })
      fireEvent.change(getByTestId('select-Mois'), { target: { value: '' } })
      fireEvent.change(getByTestId('select-Année'), { target: { value: '' } })

      const continueButton = getByTestId('date-picker-dropdown-submit-button')
      expect(continueButton).toBeDisabled()
    })

    it('should keep enable the button "Continuer" when the date is selected and is different from the current date', () => {
      const { getByTestId } = render(<DatePickerDropDown {...props} />)

      fireEvent.change(getByTestId('select-Jour'), { target: { value: '1' } })
      fireEvent.change(getByTestId('select-Mois'), { target: { value: 'Janvier' } })
      fireEvent.change(getByTestId('select-Année'), { target: { value: '1994' } })

      const continueButton = getByTestId('date-picker-dropdown-submit-button')
      expect(continueButton).toBeEnabled()
    })

    it('should call goToNextStep() when the date is selected and press the button "Continuer"', () => {
      const { getByTestId } = render(<DatePickerDropDown {...props} />)

      fireEvent.change(getByTestId('select-Jour'), { target: { value: '1' } })
      fireEvent.change(getByTestId('select-Mois'), { target: { value: 'Décembre' } })
      fireEvent.change(getByTestId('select-Année'), { target: { value: '2003' } })

      const continueButton = getByTestId('date-picker-dropdown-submit-button')
      fireEvent.click(continueButton)

      expect(props.goToNextStep).toBeCalledWith({
        birthdate: formatDateToISOStringWithoutTime(ELIGIBLE_AGE_DATE),
      })
    })
  })

  describe('- analytics -', () => {
    it('should not log SignUpTooYoung if the user is 15 years old or more', () => {
      const { getByTestId } = render(<DatePickerDropDown {...props} />)

      fireEvent.change(getByTestId('select-Jour'), { target: { value: '1' } })
      fireEvent.change(getByTestId('select-Mois'), { target: { value: 'Décembre' } })
      fireEvent.change(getByTestId('select-Année'), { target: { value: '2003' } })

      expect(analytics.logSignUpTooYoung).not.toBeCalled()
    })

    it('should log SignUpTooYoung if the user is 14 years old or less', () => {
      const { getByTestId } = render(<DatePickerDropDown {...props} />)

      fireEvent.change(getByTestId('select-Jour'), { target: { value: '1' } })
      fireEvent.change(getByTestId('select-Mois'), { target: { value: 'Janvier' } })
      fireEvent.change(getByTestId('select-Année'), { target: { value: '2006' } })

      expect(analytics.logSignUpTooYoung).toBeCalledWith(AGE)
    })
  })
})
