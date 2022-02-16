import mockdate from 'mockdate'
import React from 'react'

import { formatDateToISOStringWithoutTime } from 'libs/parsers'
import { fireEvent, render } from 'tests/utils/web'

import { DatePickerSpinner } from './DatePickerSpinner'

const CURRENT_DATE = new Date('2020-12-01T00:00:00.000Z')
const ELIGIBLE_AGE_DATE = new Date('2003-12-01T00:00:00.000Z')

const props = { goToNextStep: jest.fn(), signUp: jest.fn() }

jest.mock('features/auth/settings')

// eslint-disable-next-line local-rules/no-allow-console
allowConsole({ warn: true })

describe('<DatePickerSpinner />', () => {
  beforeEach(() => {
    mockdate.set(CURRENT_DATE)
    jest.useFakeTimers()
  })

  it('should keep disabled the button "Continuer" when the date is not selected', () => {
    const { getByTestId } = render(<DatePickerSpinner {...props} />)

    const continueButton = getByTestId('date-picker-spinner-submit-button')
    expect(continueButton).toBeDisabled()
  })

  it('should keep enable the button "Continuer" when the date is selected and is different from the current date', () => {
    const { container, getByTestId } = render(<DatePickerSpinner {...props} />)

    const day = container.getElementsByClassName('picker-scroller')[0].childNodes[0] // 01
    fireEvent.click(day)

    const month = container.getElementsByClassName('picker-scroller')[1].childNodes[11] // Décembre
    fireEvent.click(month)

    const year = container.getElementsByClassName('picker-scroller')[2].childNodes[4] // 2004
    fireEvent.click(year)

    const continueButton = getByTestId('date-picker-spinner-submit-button')
    expect(continueButton).toBeEnabled()
  })

  it('should call goToNextStep() when the date is selected and press the button "Continuer"', () => {
    const { getByTestId, container } = render(<DatePickerSpinner {...props} />)

    const day = container.getElementsByClassName('picker-scroller')[0].childNodes[0] // 01
    fireEvent.click(day)

    const month = container.getElementsByClassName('picker-scroller')[1].childNodes[11] // Décembre
    fireEvent.click(month)

    const year = container.getElementsByClassName('picker-scroller')[2].childNodes[3] // 2003
    fireEvent.click(year)

    const continueButton = getByTestId('date-picker-spinner-submit-button')
    fireEvent.click(continueButton)

    expect(props.goToNextStep).toBeCalledWith({
      birthdate: formatDateToISOStringWithoutTime(ELIGIBLE_AGE_DATE),
    })
  })
})
