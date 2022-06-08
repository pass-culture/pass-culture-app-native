import React from 'react'

import { render, fireEvent } from 'tests/utils'
import { SearchInput } from 'ui/components/inputs/SearchInput'

jest.mock('features/auth/settings')

const onChangeText = jest.fn()
const onReset = jest.fn()
const onPressLocationButton = jest.fn()

describe('SearchInput component', () => {
  it('should render SearchInput', () => {
    expect(render(<SearchInput onFocusState={() => {}} />)).toMatchSnapshot()
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

  it('should display location button if onPressLocationButton props', () => {
    const { queryByTestId } = render(<SearchInput onPressLocationButton={onPressLocationButton} />)
    const locationButton = queryByTestId('locationButton')

    expect(locationButton).toBeTruthy()
  })
})
