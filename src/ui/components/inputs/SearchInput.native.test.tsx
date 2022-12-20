import React from 'react'

import { render, fireEvent } from 'tests/utils'
import { SearchInput } from 'ui/components/inputs/SearchInput'

const onChangeText = jest.fn()
const onReset = jest.fn()

describe('SearchInput component', () => {
  it('should render SearchInput', () => {
    expect(render(<SearchInput onFocus={() => {}} />)).toMatchSnapshot()
  })

  it('should set value when user input some text', async () => {
    const { getByTestId } = render(
      <SearchInput onChangeText={onChangeText} onPressRightIcon={onReset} />
    )
    const searchInput = getByTestId('searchInput')

    await fireEvent(searchInput, 'onChangeText', 'Some text')

    expect(onChangeText).toBeCalledWith('Some text')
  })

  it('should reset input when user click on reset icon', async () => {
    const { getByTestId } = render(
      <SearchInput value="Some text" onChangeText={onChangeText} onPressRightIcon={onReset} />
    )
    const resetIcon = getByTestId('resetSearchInput')

    await fireEvent.press(resetIcon)

    expect(onReset).toHaveBeenCalledTimes(1)
  })

  it('should display "Obligatoire" when isRequiredField = true and has label', async () => {
    const { queryByText } = render(
      <SearchInput
        value="Some text"
        label="Label"
        onChangeText={onChangeText}
        onPressRightIcon={onReset}
        isRequiredField
      />
    )

    expect(queryByText('Obligatoire')).toBeTruthy()
  })

  it('should not display "Obligatoire" when isRequiredField = false and has label', async () => {
    const { queryByText } = render(
      <SearchInput
        value="Some text"
        label="Label"
        onChangeText={onChangeText}
        onPressRightIcon={onReset}
      />
    )

    expect(queryByText('Obligatoire')).toBeFalsy()
  })
})
