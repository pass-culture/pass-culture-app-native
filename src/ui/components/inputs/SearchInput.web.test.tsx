import userEvent from '@testing-library/user-event'
import React from 'react'

import { render } from 'tests/utils/web'
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

    await userEvent.type(searchInput, 'Some text')

    expect(searchInput).toHaveValue('Some text')
  })

  it('should reset input when user click on reset icon', async () => {
    const { getByTestId } = render(
      <SearchInput value="Some text" onChangeText={onChangeText} onPressRightIcon={onReset} />
    )

    const resetIcon = getByTestId('resetSearchInput')
    await userEvent.click(resetIcon)

    expect(onReset).toHaveBeenCalledTimes(1)
  })
})
