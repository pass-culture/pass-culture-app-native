import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { render, fireEvent } from 'tests/utils'
import { SearchInput } from 'ui/components/inputs/SearchInput'

jest.mock('features/auth/settings')

const onChangeText = jest.fn()
const onReset = jest.fn()

describe('SearchInput component', () => {
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

  it('should redirect on location page on location button click', async () => {
    const { getByTestId } = render(<SearchInput showLocationButton={true} />)
    const locationButton = getByTestId('locationButton')
    await fireEvent.press(locationButton)

    expect(navigate).toHaveBeenNthCalledWith(1, 'LocationFilter')
  })
})
