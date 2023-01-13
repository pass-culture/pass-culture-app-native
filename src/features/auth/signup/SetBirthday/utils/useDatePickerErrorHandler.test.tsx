import mockdate from 'mockdate'
import * as styledComponentsNative from 'styled-components/native'

import {
  AGE,
  CURRENT_DATE,
  DEFAULT_SELECTED_DATE,
  ELIGIBLE_AGE_DATE,
  FIFTEEN_YEARS_OLD_FIRST_DAY_DATE,
  FUTUR_DATE,
  NOT_ELIGIBLE_YOUNGEST_AGE_DATE,
} from 'features/auth/signup/SetBirthday/utils/fixtures'
import { analytics } from 'libs/firebase/analytics'
import { renderHook } from 'tests/utils'

import { useDatePickerErrorHandler } from './useDatePickerErrorHandler'

jest.mock('features/auth/context/SettingsContext')

describe('useDatePickerErrorHandler', () => {
  beforeEach(() => {
    mockdate.set(CURRENT_DATE)
  })

  it('should not display the error message when the date is undefined', () => {
    const { result } = renderUseDatePickerErrorHandler(undefined)
    expect(result.current.isDisabled).toEqual(true)
    expect(result.current.errorMessage).toEqual(null)
  })

  it('should not display the error message when the default selected date is selected', () => {
    const { result } = renderUseDatePickerErrorHandler(DEFAULT_SELECTED_DATE)
    expect(result.current.isDisabled).toEqual(true)
    expect(result.current.errorMessage).toEqual(null)
  })

  it('should display the error message "tu dois avoir 15 ans" when the default selected date is selected and not touch device', () => {
    const message = 'Tu dois avoir au moins 15\u00a0ans pour t’inscrire au pass Culture'
    const { result } = renderUseDatePickerErrorHandler(DEFAULT_SELECTED_DATE, false)
    expect(result.current.isDisabled).toEqual(true)
    expect(result.current.errorMessage).toEqual(message)
  })

  it('should display the error message "une date dans le futur" when the selected date is in the futur', () => {
    const message = 'Tu ne peux pas choisir une date dans le futur'
    const { result } = renderUseDatePickerErrorHandler(FUTUR_DATE)
    expect(result.current.isDisabled).toEqual(true)
    expect(result.current.errorMessage).toEqual(message)
  })

  it('should display the error message "tu dois avoir 15 ans" when the selected date is too young', () => {
    const message = 'Tu dois avoir au moins 15\u00a0ans pour t’inscrire au pass Culture'
    const { result } = renderUseDatePickerErrorHandler(NOT_ELIGIBLE_YOUNGEST_AGE_DATE)
    expect(result.current.isDisabled).toEqual(true)
    expect(result.current.errorMessage).toEqual(message)
  })

  it('should not display the error message when the user is exactly 15yo', () => {
    const { result } = renderUseDatePickerErrorHandler(FIFTEEN_YEARS_OLD_FIRST_DAY_DATE)
    expect(result.current.isDisabled).toEqual(false)
    expect(result.current.errorMessage).toEqual(null)
  })

  it('should not display the error message when the date is equal or more than 15yo', () => {
    const { result } = renderUseDatePickerErrorHandler(ELIGIBLE_AGE_DATE)
    expect(result.current.isDisabled).toEqual(false)
    expect(result.current.errorMessage).toEqual(null)
  })

  describe('- analytics -', () => {
    it('should not log SignUpTooYoung if the user is 15 years old or more', () => {
      renderUseDatePickerErrorHandler(ELIGIBLE_AGE_DATE)
      expect(analytics.logSignUpTooYoung).not.toBeCalled()
    })

    it('should log SignUpTooYoung if the user is 14 years old or less', () => {
      renderUseDatePickerErrorHandler(NOT_ELIGIBLE_YOUNGEST_AGE_DATE)
      expect(analytics.logSignUpTooYoung).toBeCalledWith(AGE)
    })
  })
})

const renderUseDatePickerErrorHandler = (date?: Date, isTouch = true) => {
  jest
    .spyOn(styledComponentsNative, 'useTheme')
    .mockReturnValue({ isTouch } as styledComponentsNative.DefaultTheme)

  return renderHook(() => useDatePickerErrorHandler(date))
}
