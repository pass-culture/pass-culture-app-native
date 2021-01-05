import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'

import { ColorsEnum } from 'ui/theme'

import { DateInput, DateInputRef, FULL_DATE_VALIDATOR } from './DateInput'

describe('DateInput Component', () => {
  it('should render ref and give access to clearFocuses function', () => {
    // given
    const myRef = React.createRef<DateInputRef>()
    render(<DateInput ref={myRef} />)

    expect(myRef.current).toBeTruthy()
    expect(myRef.current && myRef.current.clearFocuses).toBeTruthy()
  })

  describe('blur/focus behavior', () => {
    it('should blur the day input when the 2-digit day input is fulfilled', async () => {
      const { getByPlaceholderText, getByTestId } = render(<DateInput />)
      const day = getByPlaceholderText('JJ')
      const dayBar = getByTestId('datepart-bar-day')

      fireEvent.changeText(day, '01')

      // valid
      expect(dayBar.props.style[0].backgroundColor).toEqual(ColorsEnum.GREEN_VALID)
    })

    it('should blur the month input when the 2-digit month input is fulfilled', () => {
      const { getByPlaceholderText, getByTestId } = render(<DateInput />)
      const day = getByPlaceholderText('JJ')
      const month = getByPlaceholderText('MM')
      const monthBar = getByTestId('datepart-bar-month')

      fireEvent.changeText(day, '01')
      fireEvent.changeText(month, '01')

      // valid
      expect(monthBar.props.style[0].backgroundColor).toEqual(ColorsEnum.GREEN_VALID)
    })

    it('should blur the month input when the content is deleted', () => {
      const { getByPlaceholderText, getByTestId } = render(<DateInput />)
      const month = getByPlaceholderText('MM')
      const monthBar = getByTestId('datepart-bar-month')

      fireEvent.changeText(month, '01')
      fireEvent.changeText(month, '')

      // normal
      expect(monthBar.props.style[0].backgroundColor).toEqual(ColorsEnum.GREY_MEDIUM)
    })

    it('should blur the year input when the content is deleted', () => {
      const { getByPlaceholderText, getByTestId } = render(<DateInput />)
      const year = getByPlaceholderText('AAAA')
      const yearBar = getByTestId('datepart-bar-year')

      fireEvent.changeText(year, '1991')
      fireEvent.changeText(year, '')

      // normal
      expect(yearBar.props.style[0].backgroundColor).toEqual(ColorsEnum.GREY_MEDIUM)
    })
  })

  describe('input validation', () => {
    describe('Day validation', () => {
      it('should render as error when the day length is incorrect', () => {
        const { getByPlaceholderText, getByTestId } = render(<DateInput />)
        const validationBar = getByTestId('datepart-bar-day')
        const day = getByPlaceholderText('JJ')

        fireEvent.changeText(day, '1')
        const backgroundColor = validationBar.props.style[0].backgroundColor
        expect(backgroundColor).toEqual(ColorsEnum.ERROR)
      })

      it('should render as error when the day is not in the range [1, 31]', () => {
        const { getByPlaceholderText, getByTestId } = render(<DateInput />)
        const validationBar = getByTestId('datepart-bar-day')
        const day = getByPlaceholderText('JJ')

        fireEvent.changeText(day, '00')
        let backgroundColor = validationBar.props.style[0].backgroundColor
        expect(backgroundColor).toEqual(ColorsEnum.ERROR)

        fireEvent.changeText(day, '32')
        backgroundColor = validationBar.props.style[0].backgroundColor
        expect(backgroundColor).toEqual(ColorsEnum.ERROR)
      })

      it('should render as valid when the day is in the range [1, 31]', () => {
        const { getByPlaceholderText, getByTestId } = render(<DateInput />)
        const validationBar = getByTestId('datepart-bar-day')
        const day = getByPlaceholderText('JJ')

        fireEvent.changeText(day, '01')
        const backgroundColor = validationBar.props.style[0].backgroundColor
        expect(backgroundColor).toEqual(ColorsEnum.GREEN_VALID)
      })
    })

    describe('Month validation', () => {
      it('should render as error when the month length is incorrect', () => {
        const { getByPlaceholderText, getByTestId } = render(<DateInput />)
        const validationBar = getByTestId('datepart-bar-month')
        const month = getByPlaceholderText('MM')

        fireEvent.changeText(month, '1')
        const backgroundColor = validationBar.props.style[0].backgroundColor
        expect(backgroundColor).toEqual(ColorsEnum.ERROR)
      })

      it('should render as error when the month is not in the range [1, 12]', () => {
        const { getByPlaceholderText, getByTestId } = render(<DateInput />)
        const validationBar = getByTestId('datepart-bar-month')
        const month = getByPlaceholderText('MM')

        fireEvent.changeText(month, '00')
        let backgroundColor = validationBar.props.style[0].backgroundColor
        expect(backgroundColor).toEqual(ColorsEnum.ERROR)

        fireEvent.changeText(month, '13')
        backgroundColor = validationBar.props.style[0].backgroundColor
        expect(backgroundColor).toEqual(ColorsEnum.ERROR)
      })

      it('should render as valid when the month is in the range [1, 12]', () => {
        // a month is valid only is the day and the year are valid for this month
        const { getByPlaceholderText, getByTestId } = render(<DateInput />)
        const validationBar = getByTestId('datepart-bar-month')
        const day = getByPlaceholderText('JJ')
        const month = getByPlaceholderText('MM')

        fireEvent.changeText(day, '01')
        fireEvent.changeText(month, '01')
        const backgroundColor = validationBar.props.style[0].backgroundColor
        expect(backgroundColor).toEqual(ColorsEnum.GREEN_VALID)
      })
    })

    describe('Year validation', () => {
      it('should render as error when the year length is incorrect', () => {
        const { getByPlaceholderText, getByTestId } = render(<DateInput />)
        const validationBar = getByTestId('datepart-bar-year')
        const year = getByPlaceholderText('AAAA')

        fireEvent.changeText(year, '1')
        const backgroundColor = validationBar.props.style[0].backgroundColor
        expect(backgroundColor).toEqual(ColorsEnum.ERROR)
      })

      it('should render as error when the year is not in the right range', () => {
        const { getByPlaceholderText, getByTestId } = render(<DateInput />)
        const validationBar = getByTestId('datepart-bar-year')
        const year = getByPlaceholderText('AAAA')

        fireEvent.changeText(year, '0000')
        let backgroundColor = validationBar.props.style[0].backgroundColor
        expect(backgroundColor).toEqual(ColorsEnum.ERROR)

        fireEvent.changeText(year, '10000')
        backgroundColor = validationBar.props.style[0].backgroundColor
        expect(backgroundColor).toEqual(ColorsEnum.ERROR)
      })

      it('should render as valid when the year is in the right range', () => {
        const { getByPlaceholderText, getByTestId } = render(<DateInput />)
        const validationBar = getByTestId('datepart-bar-year')
        const year = getByPlaceholderText('AAAA')

        fireEvent.changeText(year, '2005')
        const backgroundColor = validationBar.props.style[0].backgroundColor
        expect(backgroundColor).toEqual(ColorsEnum.GREEN_VALID)
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

      fireEvent.changeText(getByPlaceholderText('JJ'), day)
      fireEvent.changeText(getByPlaceholderText('MM'), month)
      fireEvent.changeText(getByPlaceholderText('AAAA'), year)

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

      fireEvent.changeText(getByPlaceholderText('JJ'), '16')
      fireEvent.changeText(getByPlaceholderText('MM'), '07')
      fireEvent.changeText(getByPlaceholderText('AAAA'), '1991')

      expect(onChangeValue).toBeCalledWith('1991-07-16', {
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
      const date = new Date(Date.UTC(year, month - 1, day))
      expect(FULL_DATE_VALIDATOR.isValid(date, year, month, day)).toBeFalsy()
    })

    it.each([
      [29, 2, 2004], // leap year
      [29, 2, 2008], // leap year
      [29, 2, 2012], // leap year
      [31, 3, 2005],
      [31, 5, 2005],
      [31, 7, 2005],
      [31, 8, 2005],
    ])('should return true when the date is valid (DD-MM-AAAA) %s-%s-%s', (day, month, year) => {
      const date = new Date(Date.UTC(year, month - 1, day))
      expect(FULL_DATE_VALIDATOR.isValid(date, year, month, day)).toBeTruthy()
    })
  })

  describe('with date limits', () => {
    it('it should not validate a date below min', () => {
      const onChangeValue = jest.fn()
      const minDate = new Date('2010-01-02T00:00:00')
      const { getByPlaceholderText } = render(
        <DateInput onChangeValue={onChangeValue} minDate={minDate} />
      )

      fireEvent.changeText(getByPlaceholderText('JJ'), '01')
      fireEvent.changeText(getByPlaceholderText('MM'), '01')
      fireEvent.changeText(getByPlaceholderText('AAAA'), '2010')

      expect(onChangeValue).toBeCalledWith(null, {
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

      fireEvent.changeText(getByPlaceholderText('JJ'), '02')
      fireEvent.changeText(getByPlaceholderText('MM'), '01')
      fireEvent.changeText(getByPlaceholderText('AAAA'), '2010')

      expect(onChangeValue).toBeCalledWith(null, {
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

      fireEvent.changeText(getByPlaceholderText('JJ'), '15')
      fireEvent.changeText(getByPlaceholderText('MM'), '01')
      fireEvent.changeText(getByPlaceholderText('AAAA'), '2010')

      expect(onChangeValue).toBeCalledWith('2010-01-15', {
        isComplete: true,
        isDateAboveMin: true,
        isDateBelowMax: true,
        isValid: true,
      })
    })
  })
})
