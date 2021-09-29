import React from 'react'
import { ColorValue } from 'react-native'
import timezoneMock from 'timezone-mock'

import { fireEvent, render } from 'tests/utils'
import { ColorsEnum } from 'ui/theme'

import { DateInput, DateInputRef, FULL_DATE_VALIDATOR } from './DateInput'

describe('DateInput Component', () => {
  it('should render ref and give access to clearFocuses function', () => {
    const myRef = React.createRef<DateInputRef>()
    render(<DateInput ref={myRef} />)

    expect(myRef.current).toBeTruthy()
    expect(myRef.current && myRef.current.clearFocuses).toBeTruthy()
  })

  describe('blur/focus behavior', () => {
    describe('input validation', () => {
      describe('Date validation', () => {
        it('should render as error when the day length is incorrect', () => {
          const { getByPlaceholderText, getByTestId } = render(<DateInput />)
          const validationBar = getByTestId('date-bar')
          const date = getByPlaceholderText('JJ/MM/AAAA')

          let backgroundColor: ColorValue | undefined

          fireEvent.changeText(date, '1')
          backgroundColor = validationBar.props.style[0].backgroundColor
          expect(backgroundColor).toEqual(ColorsEnum.ERROR)

          fireEvent.changeText(date, '01/02')
          backgroundColor = validationBar.props.style[0].backgroundColor
          expect(backgroundColor).toEqual(ColorsEnum.ERROR)

          fireEvent.changeText(date, '51/51/515')
          backgroundColor = validationBar.props.style[0].backgroundColor
          expect(backgroundColor).toEqual(ColorsEnum.ERROR)
        })

        it('should render as valid when the day is in the range [1, 31]', () => {
          const { getByPlaceholderText, getByTestId } = render(<DateInput />)
          const validationBar = getByTestId('date-bar')
          const date = getByPlaceholderText('JJ/MM/AAAA')

          fireEvent.changeText(date, '01/01/1991')
          const backgroundColor = validationBar.props.style[0].backgroundColor
          expect(backgroundColor).toEqual(ColorsEnum.GREEN_VALID)
        })
      })
    })

    it.each([
      ['29', '02', '2005'], // non leap year
      ['29', '02', '2006'], // non leap year
      ['29', '02', '2007'], // non leap year
      ['31', '04', '2005'],
      ['31', '06', '2005'],
      ['31', '09', '2005'],
      ['31', '11', '2005'],
    ])('should return null for these invalid dates (DD-MM-AAAA) %s-%s-%s', (day, month, year) => {
      const onChangeValue = jest.fn()
      const { getByPlaceholderText } = render(<DateInput onChangeValue={onChangeValue} />)

      fireEvent.changeText(getByPlaceholderText('JJ/MM/AAAA'), [day, month, year].join('/'))

      expect(onChangeValue).toBeCalledWith(null, {
        isComplete: true,
        isDateAboveMin: true,
        isDateBelowMax: true,
        isValid: false,
      })
      expect(onChangeValue).not.toBeCalledWith(`${year}-${month}-${day}`)
    })

    it('should return a AAAA-MM-DD date when the 3 fields are filled properly', () => {
      const onChangeValue = jest.fn()
      const { getByPlaceholderText } = render(<DateInput onChangeValue={onChangeValue} />)

      fireEvent.changeText(getByPlaceholderText('JJ/MM/AAAA'), '16/07/1991')

      expect(onChangeValue).toBeCalledWith(new Date('1991-07-16'), {
        isComplete: true,
        isDateAboveMin: true,
        isDateBelowMax: true,
        isValid: true,
      })
    })
  })

  describe('FULL_DATE_VALIDATOR.isValid()', () => {
    it.each([
      [29, 2, 2005], // non leap year
      [29, 2, 2006], // non leap year
      [29, 2, 2007], // non leap year
      [31, 4, 2005],
      [31, 6, 2005],
      [31, 9, 2005],
      [31, 11, 2005],
    ])('should return false when the date is invalid (DD-MM-AAAA) %s-%s-%s', (day, month, year) => {
      const date = new Date(year, month - 1, day)
      expect(FULL_DATE_VALIDATOR.isValid(date, year, month, day)).toBeFalsy()
    })

    const VALID_DATES = [
      [1, 2, 2003],
      [29, 2, 2004], // leap year
      [29, 2, 2008], // leap year
      [29, 2, 2012], // leap year
      [31, 3, 2005],
      [31, 5, 2005],
      [31, 7, 2005],
      [31, 8, 2005],
    ]
    it.each(VALID_DATES)(
      'should return true when the date is valid (DD-MM-AAAA) %s-%s-%s with timezone Brazil/East',
      (day, month, year) => {
        timezoneMock.register('Brazil/East')
        const date = new Date(year, month - 1, day)
        expect(FULL_DATE_VALIDATOR.isValid(date, year, month, day)).toBeTruthy()
      }
    )
    it.each(VALID_DATES)(
      'should return true when the date is valid (DD-MM-AAAA) %s-%s-%s with timezone Europe/London',
      (day, month, year) => {
        timezoneMock.register('Europe/London')
        const date = new Date(year, month - 1, day)
        expect(FULL_DATE_VALIDATOR.isValid(date, year, month, day)).toBeTruthy()
      }
    )
  })

  describe('with date limits', () => {
    it('it should not validate a date below min', () => {
      const onChangeValue = jest.fn()
      const minDate = new Date('2010-01-02T00:00:00')
      const { getByPlaceholderText } = render(
        <DateInput onChangeValue={onChangeValue} minDate={minDate} />
      )

      fireEvent.changeText(getByPlaceholderText('JJ/MM/AAAA'), '01/01/2010')

      expect(onChangeValue).toBeCalledWith(new Date('2010-01-01'), {
        isComplete: true,
        isDateAboveMin: false,
        isDateBelowMax: true,
        isValid: false,
      })
    })

    it('it should not validate a date above max', () => {
      const onChangeValue = jest.fn()
      const maxDate = new Date('2010-01-01T00:00:00')
      const { getByPlaceholderText } = render(
        <DateInput onChangeValue={onChangeValue} maxDate={maxDate} />
      )

      fireEvent.changeText(getByPlaceholderText('JJ/MM/AAAA'), '02/01/2010')
      expect(onChangeValue).toBeCalledWith(new Date('2010-01-02'), {
        isComplete: true,
        isDateAboveMin: true,
        isDateBelowMax: false,
        isValid: false,
      })
    })

    it('it should validate a date below max and above min', () => {
      const onChangeValue = jest.fn()
      const minDate = new Date('2010-01-01T00:00:00')
      const maxDate = new Date('2010-02-01T00:00:00')
      const { getByPlaceholderText } = render(
        <DateInput onChangeValue={onChangeValue} minDate={minDate} maxDate={maxDate} />
      )

      fireEvent.changeText(getByPlaceholderText('JJ/MM/AAAA'), '15/01/2010')

      expect(onChangeValue).toBeCalledWith(new Date('2010-01-15'), {
        isComplete: true,
        isDateAboveMin: true,
        isDateBelowMax: true,
        isValid: true,
      })
    })
  })
})
