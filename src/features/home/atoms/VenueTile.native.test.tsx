import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { mockVenues } from 'libs/algolia/__mocks__/mockedVenues'
import { analytics } from 'libs/firebase/analytics'
import { fireEvent, render } from 'tests/utils'

import { VenueTile, VenueTileProps } from './VenueTile'

jest.mock('react-query')

const venue = mockVenues.hits[0]

const props: VenueTileProps = {
  moduleId: 'module-id',
  moduleName: 'le nom du module',
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

  it('should navigate to the venue when clicking on the venue tile', async () => {
    const { getByTestId } = render(<VenueTile {...props} />)
    await fireEvent.press(getByTestId('venueTile'))
    expect(navigate).toHaveBeenCalledWith('Venue', { id: venue.id })
  })

  it('should log analytics event ConsultVenue when pressing on the venue tile', async () => {
    const { getByTestId } = render(<VenueTile {...props} />)
    await fireEvent.press(getByTestId('venueTile'))
    expect(analytics.logConsultVenue).toHaveBeenNthCalledWith(1, {
      venueId: venue.id,
      from: 'home',
      moduleName: 'le nom du module',
      moduleId: 'module-id',
    })
  })
  it('should log analytics event ConsultVenue with homeEntryId when provided', async () => {
    const { getByTestId } = render(<VenueTile {...props} homeEntryId={'abcd'} />)
    await fireEvent.press(getByTestId('venueTile'))
    expect(analytics.logConsultVenue).toHaveBeenNthCalledWith(1, {
      venueId: venue.id,
      from: 'home',
      moduleName: 'le nom du module',
      moduleId: 'module-id',
      homeEntryId: 'abcd',
    })
  })
  it('should show venue placeholder when no venue does not have image', () => {
    const { getByTestId } = render(
      <VenueTile {...props} venue={{ ...venue, bannerUrl: undefined }} />
    )
    expect(getByTestId('venue-type-tile')).toBeTruthy()
  })
})
