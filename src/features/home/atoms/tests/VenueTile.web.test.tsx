import React from 'react'
import { QueryClient } from 'react-query'

import { navigate } from '__mocks__/@react-navigation/native'
import { VenueTypeCode } from 'api/gen'
import { venueResponseSnap } from 'features/venue/fixtures/venueResponseSnap'
import { analytics } from 'libs/analytics'
import { mockedSearchResponse } from 'libs/search/fixtures/mockedSearchResponse'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render } from 'tests/utils/web'

import { VenueTile } from '../VenueTile'

const venue = mockedSearchResponse.hits[0]

const props = {
  name: venue.name,
  venueType: VenueTypeCode.MUSEUM,
  venueId: Number(venue.id),
}

const setup = (queryClient: QueryClient) => {
  queryClient.setQueryData(['venue', props.venueId], venueResponseSnap)
}

describe('VenueTile component', () => {
  it('should render correctly', () => {
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    const component = render(reactQueryProviderHOC(<VenueTile {...props} />, setup))
    expect(component).toMatchSnapshot()
  })

  it('should navigate to the venue when clicking on the image', () => {
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    const { getByTestId } = render(reactQueryProviderHOC(<VenueTile {...props} />, setup))
    fireEvent.click(getByTestId('venueTile'))
    expect(navigate).toHaveBeenCalledWith('Venue', {
      id: props.venueId,
    })
  })

  it('should log analytics event ConsultVenue when pressing on the venue tile', () => {
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    const { getByTestId } = render(reactQueryProviderHOC(<VenueTile {...props} />, setup))
    fireEvent.click(getByTestId('venueTile'))
    expect(analytics.logConsultVenue).toHaveBeenNthCalledWith(1, {
      venueId: props.venueId,
      from: 'home',
    })
  })
})
