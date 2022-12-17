import mockdate from 'mockdate'
import React from 'react'

import { CURRENT_DATE, ELIGIBLE_AGE_DATE } from 'features/auth/signup/SetBirthday/utils/fixtures'
import { formatDateToISOStringWithoutTime } from 'libs/parsers'
import { fireEvent, render } from 'tests/utils'

import { SetBirthday } from './SetBirthday'

const props = { goToNextStep: jest.fn(), signUp: jest.fn() }

jest.mock('features/auth/SettingsContext')

describe('<SetBirthday />', () => {
  beforeEach(() => {
    mockdate.set(CURRENT_DATE)
  })

  it('should render correctly', () => {
    const renderAPI = render(<SetBirthday {...props} />)
    expect(renderAPI).toMatchSnapshot()
  })

  it('should call goToNextStep() when the date is selected and press the button "Continuer"', () => {
    const { getByTestId } = render(<SetBirthday {...props} />)

    const datePicker = getByTestId('date-picker-spinner-native')
    fireEvent(datePicker, 'onChange', { nativeEvent: { timestamp: ELIGIBLE_AGE_DATE } })

    const continueButton = getByTestId('Continuer')
    fireEvent.press(continueButton)

    expect(props.goToNextStep).toBeCalledWith({
      birthdate: formatDateToISOStringWithoutTime(ELIGIBLE_AGE_DATE),
    })
  })
})
