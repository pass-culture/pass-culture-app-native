import mockdate from 'mockdate'
import React from 'react'

import { CURRENT_DATE, ELIGIBLE_AGE_DATE } from 'features/auth/signup/SetBirthday/utils/fixtures'
import { analytics } from 'libs/firebase/analytics'
import { formatDateToISOStringWithoutTime } from 'libs/parsers'
import { fireEvent, render } from 'tests/utils'

import { SetBirthday } from './SetBirthday'

const props = { goToNextStep: jest.fn(), signUp: jest.fn() }

jest.mock('features/auth/settings')

describe('<SetBirthday />', () => {
  beforeEach(() => {
    mockdate.set(CURRENT_DATE)
  })

  it('should render correctly', () => {
    const renderAPI = render(<SetBirthday {...props} />)
    expect(renderAPI).toMatchSnapshot()
  })

  it('should display a information modal when clicking "Pour quelle raison\u00a0?" button', () => {
    const { getByTestId } = render(<SetBirthday {...props} />)

    const whyBirthdayButton = getByTestId('Pour quelle raison\u00a0?')
    fireEvent.press(whyBirthdayButton)

    const birthdayModal = getByTestId('modal-birthday-information')
    expect(birthdayModal.props.visible).toBeTruthy()
  })

  it('should log ConsultModalWhyAnniversary when clicking "Pour quelle raison\u00a0?" button', () => {
    const { getByTestId } = render(<SetBirthday {...props} />)

    const whyBirthdayLink = getByTestId('Pour quelle raison\u00a0?')
    fireEvent.press(whyBirthdayLink)

    expect(analytics.logConsultWhyAnniversary).toHaveBeenCalledTimes(1)
  })

  it('should call goToNextStep() when the date is selected and press the button "Continuer"', () => {
    const { getByTestId } = render(<SetBirthday {...props} />)

    const datePicker = getByTestId('date-picker-spinner-native')
    fireEvent(datePicker, 'onChange', { nativeEvent: { timestamp: ELIGIBLE_AGE_DATE } })

    const continueButton = getByTestId('date-picker-submit-button')
    fireEvent.press(continueButton)

    expect(props.goToNextStep).toBeCalledWith({
      birthdate: formatDateToISOStringWithoutTime(ELIGIBLE_AGE_DATE),
    })
  })
})
