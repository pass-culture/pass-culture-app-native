import React from 'react'

import { fireEvent, render } from 'tests/utils'
import { ColorsEnum } from 'ui/theme'

import { ShortInput } from './ShortInput'

describe('ShortInput Component', () => {
  it('should call onChangeValue when the value is modified', () => {
    const onChangeValue = jest.fn()
    const { getByPlaceholderText } = render(
      <ShortInput
        identifier="identifier"
        onChangeValue={onChangeValue}
        placeholder="PP"
        testID="testID"
      />
    )
    const input = getByPlaceholderText('PP')

    fireEvent.changeText(input, '10')
    expect(onChangeValue).toBeCalledWith('10', 'identifier')
  })
  it('has a maxlength of the placeholder length', () => {
    const onChangeValue = jest.fn()
    const { getByPlaceholderText } = render(
      <ShortInput
        identifier="identifier"
        onChangeValue={onChangeValue}
        placeholder="PP"
        testID="testID"
      />
    )
    const input = getByPlaceholderText('PP')

    expect(input.props.maxLength).toEqual(2)
  })
  describe('Bar behavior', () => {
    afterEach(() => jest.restoreAllMocks())

    it('should display a grey bar when empty', () => {
      const onChangeValue = jest.fn()
      const { getByTestId } = render(
        <ShortInput
          identifier="identifier"
          onChangeValue={onChangeValue}
          placeholder="PP"
          testID="testID"
        />
      )
      const validationBar = getByTestId('datepart-bar-identifier')

      const { backgroundColor, height } = validationBar.props.style[0]

      expect(backgroundColor).toEqual(ColorsEnum.GREY_MEDIUM)
      expect(height).toEqual(5)
    })
    it('should display a red_error bar when not empty && isValid=false', () => {
      const onChangeValue = jest.fn()
      const { getByTestId, getByPlaceholderText } = render(
        <ShortInput
          identifier="identifier"
          isValid={false}
          onChangeValue={onChangeValue}
          placeholder="PP"
          testID="testID"
        />
      )

      const input = getByPlaceholderText('PP')
      fireEvent.changeText(input, '10')

      const validationBar = getByTestId('datepart-bar-identifier')
      const { backgroundColor } = validationBar.props.style[0]

      expect(backgroundColor).toEqual(ColorsEnum.ERROR)
    })
    it('should display a green bar when  not empty && isValid=true', () => {
      const onChangeValue = jest.fn()
      const { getByTestId, getByPlaceholderText } = render(
        <ShortInput
          identifier="identifier"
          isValid
          onChangeValue={onChangeValue}
          placeholder="PP"
          testID="testID"
        />
      )

      const input = getByPlaceholderText('PP')
      fireEvent.changeText(input, '10')

      const validationBar = getByTestId('datepart-bar-identifier')
      const { backgroundColor } = validationBar.props.style[0]

      expect(backgroundColor).toEqual(ColorsEnum.GREEN_VALID)
    })
    it('should display a pink bar when focused', () => {
      const onChangeValue = jest.fn()
      const { getByTestId, getByPlaceholderText } = render(
        <ShortInput
          identifier="identifier"
          isValid
          onChangeValue={onChangeValue}
          placeholder="PP"
          testID="testID"
        />
      )

      const input = getByPlaceholderText('PP')
      fireEvent(input, 'focus')

      const validationBar = getByTestId('datepart-bar-identifier')
      const { backgroundColor } = validationBar.props.style[0]

      expect(backgroundColor).toEqual(ColorsEnum.PRIMARY)
    })
  })
})
