import mockdate from 'mockdate'
import React from 'react'

import { fireEvent, render } from 'tests/utils/web'

import { DatePickerSpinner } from './DatePickerSpinner'

const CURRENT_DATE = new Date('2020-12-01T00:00:00.000Z')
const ELIGIBLE_AGE_DATE = new Date('2003-12-01T00:00:00.000Z')

const props = { goToNextStep: jest.fn(), signUp: jest.fn() }

jest.mock('features/auth/settings')

describe('<DatePickerSpinner />', () => {
  beforeEach(() => {
    mockdate.set(CURRENT_DATE)
    jest.useFakeTimers()
  })

  it('should keep disabled the button "Continuer" when the date is not selected', () => {
    const { getByText } = render(<DatePickerSpinner {...props} />)

    const continueButton = getByText('Continuer')
    expect(continueButton).toBeDisabled()
  })

  it('should keep enable the button "Continuer" when the date is selected and is different from the current date', () => {
    const { getByTestId, getByText } = render(<DatePickerSpinner {...props} />)

    fireEvent.change(getByTestId('datePickerTouch'), { target: { value: ELIGIBLE_AGE_DATE } })

    const continueButton = getByText('Continuer')
    expect(continueButton).toBeEnabled()
  })
})
