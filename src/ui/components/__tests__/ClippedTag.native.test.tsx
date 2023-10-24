import React from 'react'

import { fireEvent, render, screen } from 'tests/utils'

import { ClippedTag } from '../ClippedTag'

const label = 'Musée du louvre'
const removeVenueId = jest.fn()
const accessibilityLabel = 'Enlever le lieu'

describe('<ClippedTag/>', () => {
  it('should render correctly', () => {
    render(
      <ClippedTag
        label={label}
        onPress={removeVenueId}
        iconAccessibilityLabel={accessibilityLabel}
      />
    )

    expect(screen).toMatchSnapshot()
  })

  it('should delete venueId and ClippedTag when clicking on Clear icon', () => {
    render(
      <ClippedTag
        label={label}
        onPress={removeVenueId}
        iconAccessibilityLabel={accessibilityLabel}
      />
    )

    const clearIcon = screen.getByTestId('Enlever le lieu')
    fireEvent.press(clearIcon)

    expect(removeVenueId).toHaveBeenCalledTimes(1)
  })
})
