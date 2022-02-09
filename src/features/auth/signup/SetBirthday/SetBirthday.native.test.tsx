import mockdate from 'mockdate'
import React from 'react'

import { analytics } from 'libs/analytics'
import { formatDateToISOStringWithoutTime } from 'libs/parsers'
import { fireEvent, render } from 'tests/utils'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

import { SetBirthday } from './SetBirthday'

const CURRENT_DATE = new Date('2020-12-01T00:00:00.000Z')
const DEFAULT_SELECTED_DATE = new Date('2006-12-01T00:00:00.000Z')
const ELIGIBLE_AGE_DATE = new Date('2003-12-01T00:00:00.000Z')
const FIFTEEN_YEARS_OLD_FIRST_DAY_DATE = new Date('2005-12-01T00:00:00.000Z')
const NOT_ELIGIBLE_YOUNGEST_AGE_DATE = new Date('2006-01-01T00:00:00.000Z')

const props = { goToNextStep: jest.fn(), signUp: jest.fn() }

jest.mock('features/auth/settings')

describe('<SetBirthday />', () => {
  beforeEach(() => {
    mockdate.set(CURRENT_DATE)
    jest.useFakeTimers()
  })

  it('should render correctly', () => {
    const renderAPI = render(<SetBirthday {...props} />)
    expect(renderAPI).toMatchSnapshot()
  })

  describe('- navigation -', () => {
    it('should display a information modal when clicking "Pour quelle raison ?" button', () => {
      const { getByTestId } = render(<SetBirthday {...props} />)

      const whyBirthdayButton = getByTestId('Pour quelle raison\u00a0?')
      fireEvent.press(whyBirthdayButton)

      const birthdayModal = getByTestId('modal-birthday-information')
      expect(birthdayModal.props.visible).toBeTruthy()
    })

    it('should keep disabled the button "Continuer" when the date is not selected', () => {
      const { getByTestId } = render(<SetBirthday {...props} />)

      const datePicker = getByTestId('datePicker')
      fireEvent(datePicker, 'onChange', { nativeEvent: { timestamp: CURRENT_DATE } })

      const continueButton = getByTestId('Continuer')
      expect(continueButton.props.style.backgroundColor).toEqual(ColorsEnum.GREY_LIGHT)
    })

    it('should keep enable the button "Continuer" when the date is selected and is different from the current date', () => {
      const { getByTestId } = render(<SetBirthday {...props} />)

      const datePicker = getByTestId('datePicker')
      fireEvent(datePicker, 'onChange', { nativeEvent: { timestamp: ELIGIBLE_AGE_DATE } })

      const continueButton = getByTestId('Continuer')
      expect(continueButton.props.style.backgroundColor).toEqual(ColorsEnum.PRIMARY)
    })

    it('should call goToNextStep() when the date is selected and press the button "Continuer"', () => {
      const { getByTestId } = render(<SetBirthday {...props} />)

      const datePicker = getByTestId('datePicker')
      fireEvent(datePicker, 'onChange', { nativeEvent: { timestamp: ELIGIBLE_AGE_DATE } })

      const continueButton = getByTestId('Continuer')
      fireEvent.press(continueButton)

      expect(props.goToNextStep).toBeCalledWith({
        birthdate: formatDateToISOStringWithoutTime(ELIGIBLE_AGE_DATE),
      })
    })
  })

  describe('- error message -', () => {
    it('should display the error message "tu dois avoir 15 ans" when the selected date is too young', () => {
      const { getByTestId, queryByText } = render(<SetBirthday {...props} />)

      const datePicker = getByTestId('datePicker')
      fireEvent(datePicker, 'onChange', {
        nativeEvent: { timestamp: NOT_ELIGIBLE_YOUNGEST_AGE_DATE },
      })

      const message = 'Tu dois avoir au moins\u00a015\u00a0ans pour t’inscrire au pass Culture'
      expect(queryByText(message)).toBeTruthy()
    })

    it('should not display the error message "tu dois avoir 15 ans" when the user is exactly 15yo', () => {
      const { getByTestId, queryByText } = render(<SetBirthday {...props} />)

      const datePicker = getByTestId('datePicker')
      fireEvent(datePicker, 'onChange', {
        nativeEvent: { timestamp: FIFTEEN_YEARS_OLD_FIRST_DAY_DATE },
      })

      const message = 'Tu dois avoir au moins\u00a015\u00a0ans pour t’inscrire au pass Culture'
      expect(queryByText(message)).toBeNull()
    })

    it('should not display the error message "tu dois avoir 15 ans" when the selected date is the current date', () => {
      const { getByTestId, queryByText } = render(<SetBirthday {...props} />)

      const datePicker = getByTestId('datePicker')
      fireEvent(datePicker, 'onChange', { nativeEvent: { timestamp: DEFAULT_SELECTED_DATE } })

      const message = 'Tu dois avoir au moins\u00a015\u00a0ans pour t’inscrire au pass Culture'
      expect(queryByText(message)).toBeNull()
    })
  })

  describe('- analytics -', () => {
    it('should log ConsultModalWhyAnniversary when clicking "Pour quelle raison ?" button', () => {
      const { getByTestId } = render(<SetBirthday {...props} />)

      const whyBirthdayLink = getByTestId('Pour quelle raison\u00a0?')
      fireEvent.press(whyBirthdayLink)

      expect(analytics.logConsultWhyAnniversary).toHaveBeenCalledTimes(1)
    })

    it('should not log SignUpTooYoung if the user is 15 years old or more', () => {
      const { getByTestId } = render(<SetBirthday {...props} />)

      const datePicker = getByTestId('datePicker')
      fireEvent(datePicker, 'onChange', { nativeEvent: { timestamp: ELIGIBLE_AGE_DATE } })

      expect(analytics.logSignUpTooYoung).not.toBeCalled()
    })

    it('should log SignUpTooYoung if the user is 14 years old or less', () => {
      const { getByTestId } = render(<SetBirthday {...props} />)

      const datePicker = getByTestId('datePicker')
      fireEvent(datePicker, 'onChange', {
        nativeEvent: { timestamp: NOT_ELIGIBLE_YOUNGEST_AGE_DATE },
      })

      expect(analytics.logSignUpTooYoung).toBeCalled()
    })
  })
})
