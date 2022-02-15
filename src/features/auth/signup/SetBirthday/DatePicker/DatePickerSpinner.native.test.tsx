import mockdate from 'mockdate'
import React from 'react'

import { analytics } from 'libs/analytics'
import { formatDateToISOStringWithoutTime } from 'libs/parsers'
import { fireEvent, render } from 'tests/utils'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

import { DatePickerSpinner } from './DatePickerSpinner'

const CURRENT_DATE = new Date('2020-12-01T00:00:00.000Z')
const ELIGIBLE_AGE_DATE = new Date('2003-12-01T00:00:00.000Z')
const NOT_ELIGIBLE_YOUNGEST_AGE_DATE = new Date('2006-01-01T00:00:00.000Z')

const props = { goToNextStep: jest.fn(), signUp: jest.fn() }

jest.mock('features/auth/settings')

describe('<DatePickerSpinner />', () => {
  beforeEach(() => {
    mockdate.set(CURRENT_DATE)
    jest.useFakeTimers()
  })

  describe('- navigation -', () => {
    it('should keep disabled the button "Continuer" when the date is not selected', () => {
      const { getByTestId } = render(<DatePickerSpinner {...props} />)

      const datePicker = getByTestId('datePicker')
      fireEvent(datePicker, 'onChange', { nativeEvent: { timestamp: CURRENT_DATE } })

      const continueButton = getByTestId('Continuer')
      expect(continueButton.props.style.backgroundColor).toEqual(ColorsEnum.GREY_LIGHT)
    })

    it('should keep enable the button "Continuer" when the date is selected and is different from the current date', () => {
      const { getByTestId } = render(<DatePickerSpinner {...props} />)

      const datePicker = getByTestId('datePicker')
      fireEvent(datePicker, 'onChange', { nativeEvent: { timestamp: ELIGIBLE_AGE_DATE } })

      const continueButton = getByTestId('Continuer')
      expect(continueButton.props.style.backgroundColor).toEqual(ColorsEnum.PRIMARY)
    })

    it('should call goToNextStep() when the date is selected and press the button "Continuer"', () => {
      const { getByTestId } = render(<DatePickerSpinner {...props} />)

      const datePicker = getByTestId('datePicker')
      fireEvent(datePicker, 'onChange', { nativeEvent: { timestamp: ELIGIBLE_AGE_DATE } })

      const continueButton = getByTestId('Continuer')
      fireEvent.press(continueButton)

      expect(props.goToNextStep).toBeCalledWith({
        birthdate: formatDateToISOStringWithoutTime(ELIGIBLE_AGE_DATE),
      })
    })
  })

  describe('- analytics -', () => {
    it('should not log SignUpTooYoung if the user is 15 years old or more', () => {
      const { getByTestId } = render(<DatePickerSpinner {...props} />)

      const datePicker = getByTestId('datePicker')
      fireEvent(datePicker, 'onChange', { nativeEvent: { timestamp: ELIGIBLE_AGE_DATE } })

      expect(analytics.logSignUpTooYoung).not.toBeCalled()
    })

    it('should log SignUpTooYoung if the user is 14 years old or less', () => {
      const { getByTestId } = render(<DatePickerSpinner {...props} />)

      const datePicker = getByTestId('datePicker')
      fireEvent(datePicker, 'onChange', {
        nativeEvent: { timestamp: NOT_ELIGIBLE_YOUNGEST_AGE_DATE },
      })

      expect(analytics.logSignUpTooYoung).toBeCalled()
    })
  })
})
