import React from 'react'

import { fireEvent, render, screen } from 'tests/utils'
import { theme } from 'theme'

import { VenueSelectionListItem } from './VenueSelectionListItem'

describe('<VenueSelectionListItem />', () => {
  it('should apply different styles when selected', () => {
    render(
      <VenueSelectionListItem
        title="Jest"
        address="Somewhere in you memory"
        onSelect={jest.fn()}
        isSelected
      />
    )

    expect(screen.getByTestId('venue-selection-list-item')).toHaveStyle({
      borderColor: theme.colors.black,
    })
  })

  it('should set `isSelected` to `false` by default', () => {
    render(
      <VenueSelectionListItem title="Jest" address="Somewhere in you memory" onSelect={jest.fn()} />
    )

    expect(screen.getByTestId('venue-selection-list-item')).toHaveStyle({
      borderColor: theme.colors.greySemiDark,
    })
  })

  it('should call `onSelect` when selecting', () => {
    const onSelect = jest.fn()

    render(
      <VenueSelectionListItem title="Jest" address="Somewhere in you memory" onSelect={onSelect} />
    )

    fireEvent.press(screen.getByText('Jest'))

    expect(onSelect).toHaveBeenCalledTimes(1)
  })
})
