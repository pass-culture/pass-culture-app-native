import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'

import { ColorsEnum } from 'ui/theme'

import { DateInput, isValidDate, Oldest, Youngest } from './DateInput'

describe('DateInput Component', () => {
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
    it('should blur the year input when the 4-digit year is fulfilled', () => {
      const { getByPlaceholderText, getByTestId } = render(<DateInput />)
      const day = getByPlaceholderText('JJ')
      const month = getByPlaceholderText('MM')
      const year = getByPlaceholderText('YYYY')
      const yearBar = getByTestId('datepart-bar-year')

      fireEvent.changeText(day, '01')
      fireEvent.changeText(month, '01')
      fireEvent.changeText(year, '2004')

      // valid
      expect(yearBar.props.style[0].backgroundColor).toEqual(ColorsEnum.GREEN_VALID)
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
        const year = getByPlaceholderText('YYYY')

        fireEvent.changeText(year, '1')
        const backgroundColor = validationBar.props.style[0].backgroundColor
        expect(backgroundColor).toEqual(ColorsEnum.ERROR)
      })
      it('should render as error when the year is not in the right range', () => {
        const { getByPlaceholderText, getByTestId } = render(<DateInput />)
        const validationBar = getByTestId('datepart-bar-year')
        const year = getByPlaceholderText('YYYY')

        fireEvent.changeText(year, `${Oldest - 1}`)
        let backgroundColor = validationBar.props.style[0].backgroundColor
        expect(backgroundColor).toEqual(ColorsEnum.ERROR)

        fireEvent.changeText(year, `${Youngest + 1}`)
        backgroundColor = validationBar.props.style[0].backgroundColor
        expect(backgroundColor).toEqual(ColorsEnum.ERROR)
      })
      it('should render as valid when the year is in the right range', () => {
        const { getByPlaceholderText, getByTestId } = render(<DateInput />)
        const validationBar = getByTestId('datepart-bar-year')
        const year = getByPlaceholderText('YYYY')

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
    ])('should return null for these invalid dates (DD-MM-YYYY) %s-%s-%s', (day, month, year) => {
      const onChangeValue = jest.fn()
      const { getByPlaceholderText } = render(<DateInput onChangeValue={onChangeValue} />)

      fireEvent.changeText(getByPlaceholderText('JJ'), day)
      fireEvent.changeText(getByPlaceholderText('MM'), month)
      fireEvent.changeText(getByPlaceholderText('YYYY'), year)

      expect(onChangeValue).toBeCalledWith(null)
      expect(onChangeValue).not.toBeCalledWith(`${year}-${month}-${day}`)
    })
    it('should return a YYYY-MM-DD date when the 3 fields are filled properly', () => {
      const onChangeValue = jest.fn()
      const { getByPlaceholderText } = render(<DateInput onChangeValue={onChangeValue} />)

      fireEvent.changeText(getByPlaceholderText('JJ'), '16')
      fireEvent.changeText(getByPlaceholderText('MM'), '07')
      fireEvent.changeText(getByPlaceholderText('YYYY'), '1991')

      expect(onChangeValue).toBeCalledWith(`1991-07-16`)
    })
  })
  describe('isValidDate', () => {
    it.each([
      [29, 2, 2005], // non leap year
      [29, 2, 2006], // non leap year
      [29, 2, 2007], // non leap year
      [31, 4, 2005],
      [31, 6, 2005],
      [31, 9, 2005],
      [31, 11, 2005],
    ])('should return false when the date is valid (DD-MM-YYYY) %s-%s-%s', (day, month, year) => {
      expect(isValidDate(year, month, day)).toBeFalsy()
    })
  })
})
