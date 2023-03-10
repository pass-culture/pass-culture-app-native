import React from 'react'

import { fireEvent, render, screen } from 'tests/utils/web'

import { ClippedTag } from '../ClippedTag'

const label = 'Musée du louvre'
const removeVenueId = jest.fn()
const accessibilityLabel = 'Enlever le lieu'

describe('<ClippedTag/>', () => {
  it('should render correctly', () => {
    const renderAPI = render(
      <ClippedTag
        label={label}
        onPress={removeVenueId}
        iconAccessibilityLabel={accessibilityLabel}
      />
    )
    expect(renderAPI).toMatchSnapshot()
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
    fireEvent.click(clearIcon)
    expect(removeVenueId).toHaveBeenCalledTimes(1)
  })
})
