import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { mockVenues } from 'libs/algolia/mockedResponses/mockedVenues'
import { analytics } from 'libs/analytics'
import { fireEvent, render } from 'tests/utils/web'

import { VenueTile, VenueTileProps } from '../VenueTile'

jest.mock('react-query')

const venue = mockVenues.hits[0]

const props: VenueTileProps = {
  venue,
  userPosition: null,
  width: 100,
  height: 100,
}

describe('VenueTile component', () => {
  it('should render correctly', () => {
    const component = render(<VenueTile {...props} />)
    expect(component).toMatchSnapshot()
  })

  it('should navigate to the venue when clicking on the image', () => {
    const { getByTestId } = render(<VenueTile {...props} />)
    fireEvent.click(getByTestId('venueTile'))
    expect(navigate).toHaveBeenCalledWith('Venue', { id: venue.id })
  })

  it('should log analytics event ConsultVenue when pressing on the venue tile', () => {
    const { getByTestId } = render(<VenueTile {...props} />)
    fireEvent.click(getByTestId('venueTile'))
    expect(analytics.logConsultVenue).toHaveBeenNthCalledWith(1, {
      venueId: venue.id,
      from: 'home',
    })
  })
})
