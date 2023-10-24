import React from 'react'

import { mockVenues } from 'libs/algolia/__mocks__/mockedVenues'
import { DisplayParametersFields } from 'libs/contentful/types'
import { render, screen } from 'tests/utils'

import { VenuesModule } from './VenuesModule'

jest.mock('react-query')

const props = {
  moduleId: 'fakemoduleid',
  displayParameters: { title: 'Module title', minOffers: 1 } as DisplayParametersFields,
  search: [],
  homeEntryId: 'fakeEntryId',
  index: 1,
  data: {
    playlistItems: mockVenues.hits,
    nbPlaylistResults: mockVenues.hits.length,
    moduleId: 'fakemoduleid',
  },
}

describe('VenuesModule component', () => {
  it('should render correctly', () => {
    render(<VenuesModule {...props} />)

    expect(screen).toMatchSnapshot()
  })

  it('should not render if data is undefined', () => {
    render(<VenuesModule {...{ ...props, data: undefined }} />)

    expect(screen.toJSON()).not.toBeOnTheScreen()
  })
})
