import React from 'react'

import { render, fireEvent, screen } from 'tests/utils'
import { SearchInput } from 'ui/components/inputs/SearchInput'

const onChangeText = jest.fn()
const onReset = jest.fn()

describe('SearchInput component', () => {
  it('should render SearchInput', () => {
    expect(render(<SearchInput onFocus={jest.fn()} />)).toMatchSnapshot()
  })

  it('should set value when user input some text', async () => {
    render(<SearchInput onChangeText={onChangeText} onPressRightIcon={onReset} />)

    const searchInput = screen.getByTestId('searchInput')

    fireEvent(searchInput, 'onChangeText', 'Some text')

    expect(onChangeText).toHaveBeenCalledWith('Some text')
  })

  it('should reset input when user click on reset icon', async () => {
    render(<SearchInput value="Some text" onChangeText={onChangeText} onPressRightIcon={onReset} />)

    const resetIcon = screen.getByTestId('Réinitialiser la recherche')

    fireEvent.press(resetIcon)

    expect(onReset).toHaveBeenCalledTimes(1)
  })

  it('should display "Obligatoire" when isRequiredField = true and has label', async () => {
    render(
      <SearchInput
        value="Some text"
        label="Label"
        onChangeText={onChangeText}
        onPressRightIcon={onReset}
        isRequiredField
      />
    )

    expect(screen.getByText('Obligatoire')).toBeOnTheScreen()
  })

  it('should not display "Obligatoire" when isRequiredField = false and has label', async () => {
    render(
      <SearchInput
        value="Some text"
        label="Label"
        onChangeText={onChangeText}
        onPressRightIcon={onReset}
      />
    )

    expect(screen.queryByText('Obligatoire')).not.toBeOnTheScreen()
  })
})
