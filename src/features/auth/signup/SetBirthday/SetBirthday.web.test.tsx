import mockdate from 'mockdate'
import React from 'react'

import { analytics } from 'libs/analytics'
import { fireEvent, render } from 'tests/utils/web'

import { SetBirthday } from './SetBirthday'

const CURRENT_DATE = new Date('2020-12-01T00:00:00.000Z')

const props = { goToNextStep: jest.fn(), signUp: jest.fn() }

jest.mock('features/auth/settings')

describe('<SetBirthday />', () => {
  beforeEach(() => {
    mockdate.set(CURRENT_DATE)
    jest.useFakeTimers()
  })

  describe('- No touch device -', () => {
    it('should render correctly', () => {})

    describe('- navigation -', () => {
      it('should keep disabled the button "Continuer" when the date is not selected', () => {})

      it('should keep enable the button "Continuer" when the date is selected and is different from the current date', () => {})

      it('should call goToNextStep() when the date is selected and press the button "Continuer"', () => {})
    })

    describe('- error message -', () => {
      it('should display the error message "tu dois avoir 15 ans" when the selected date is too young', () => {})

      it('should not display the error message "tu dois avoir 15 ans" when the user is exactly 15yo', () => {})

      it('should not display the error message "tu dois avoir 15 ans" when the selected date is the current date', () => {})
    })

    describe('- analytics -', () => {
      it('should log ConsultModalWhyAnniversary when clicking "Pour quelle raison ?" button', () => {
        const { getByText } = render(<SetBirthday {...props} />)

        const whyBirthdayLink = getByText('Pour quelle raison ?')
        fireEvent.click(whyBirthdayLink)

        expect(analytics.logConsultWhyAnniversary).toHaveBeenCalledTimes(1)
      })

      it('should not log SignUpTooYoung if the user is 15 years old or more', () => {})

      it('should log SignUpTooYoung if the user is 14 years old or less', () => {})
    })
  })
})
