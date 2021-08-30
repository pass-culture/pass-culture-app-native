import React from 'react'

import { fireEvent, render } from 'tests/utils/web'

import { ClippedTag } from '../ClippedTag'

const label = 'Musée du louvre'
const removeVenueId = jest.fn()
const testId = 'Enlever le lieu'

describe('<ClippedTag/>', () => {
  it('should render correctly', () => {
    const renderAPI = render(<ClippedTag label={label} onPress={removeVenueId} testId={testId} />)
    expect(renderAPI).toMatchSnapshot()
  })

  it('should delete venueId and ClippedTag when clicking on Clear icon', () => {
    const { getByTestId } = render(
      <ClippedTag label={label} onPress={removeVenueId} testId={testId} />
    )

    const clearIcon = getByTestId('Enlever le lieu')
    fireEvent.click(clearIcon)
    expect(removeVenueId).toHaveBeenCalledTimes(1)
  })
})
