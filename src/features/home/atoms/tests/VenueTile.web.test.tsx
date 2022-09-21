import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { mockVenues } from 'libs/algolia/mockedResponses/mockedVenues'
import { analytics } from 'libs/firebase/analytics'
import { fireEvent, render } from 'tests/utils/web'

import { VenueTile, VenueTileProps } from '../VenueTile'

jest.mock('react-query')
jest.mock('ui/theme/customFocusOutline/customFocusOutline')

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

  it('should navigate to the venue when clicking on the image', async () => {
    const { getByTestId } = render(<VenueTile {...props} />)
    await fireEvent.click(getByTestId('venueTile'))
    expect(navigate).toHaveBeenCalledWith('Venue', { id: venue.id })
  })

  it('should log analytics event ConsultVenue when pressing on the venue tile', async () => {
    const { getByTestId } = render(<VenueTile {...props} />)
    await fireEvent.click(getByTestId('venueTile'))
    expect(analytics.logConsultVenue).toHaveBeenNthCalledWith(1, {
      venueId: venue.id,
      from: 'home',
      moduleName: 'le nom du module',
      moduleId: 'module-id',
    })
  })
  it('should log analytics event ConsultVenue with homeEntryId when provided', async () => {
    const { getByTestId } = render(<VenueTile {...props} homeEntryId={'abcd'} />)
    await fireEvent.click(getByTestId('venueTile'))
    expect(analytics.logConsultVenue).toHaveBeenNthCalledWith(1, {
      venueId: venue.id,
      from: 'home',
      moduleName: 'le nom du module',
      moduleId: 'module-id',
      homeEntryId: 'abcd',
    })
  })
})
