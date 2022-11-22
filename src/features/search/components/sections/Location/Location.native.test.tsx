import React from 'react'

import { Location } from 'features/search/components/sections/Location/Location'
import { initialSearchState } from 'features/search/context/reducer'
import { LocationType, RadioButtonLocation } from 'features/search/enums'
import { GeoCoordinates } from 'libs/geolocation'
import { render, fireEvent, superFlushWithAct } from 'tests/utils'
import * as useModalAPI from 'ui/components/modals/useModal'

const mockSearchState = jest.fn().mockReturnValue({
  searchState: initialSearchState,
  dispatch: jest.fn(),
})

jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => mockSearchState(),
}))

const DEFAULT_POSITION: GeoCoordinates = { latitude: 2, longitude: 40 }
let mockPosition: GeoCoordinates | null = DEFAULT_POSITION

jest.mock('libs/geolocation/GeolocationWrapper', () => ({
  useGeolocation: () => ({
    position: mockPosition,
  }),
}))

describe('Location component', () => {
  afterEach(() => {
    mockPosition = DEFAULT_POSITION
  })

  it(`should have EVERYWHERE description's by default`, async () => {
    const { getByText, queryByText } = await renderLocation()
    expect(getByText(RadioButtonLocation.EVERYWHERE)).toBeTruthy()
    expect(queryByText(RadioButtonLocation.AROUND_ME)).toBeFalsy()
    expect(queryByText(RadioButtonLocation.CHOOSE_PLACE_OR_VENUE)).toBeFalsy()
  })

  it(`should not have description when EVERYWHERE selected and position is null`, async () => {
    mockPosition = null
    const { queryByText } = await renderLocation()
    expect(queryByText(RadioButtonLocation.EVERYWHERE)).toBeFalsy()
    expect(queryByText(RadioButtonLocation.AROUND_ME)).toBeFalsy()
    expect(queryByText(RadioButtonLocation.CHOOSE_PLACE_OR_VENUE)).toBeFalsy()
  })

  it(`should have AROUND_ME description's when selected`, async () => {
    mockSearchState.mockReturnValueOnce({
      searchState: {
        locationFilter: { locationType: LocationType.AROUND_ME, aroundRadius: null },
      },
    })
    const { getByText, queryByText } = await renderLocation()
    expect(queryByText(RadioButtonLocation.EVERYWHERE)).toBeFalsy()
    expect(getByText(RadioButtonLocation.AROUND_ME)).toBeTruthy()
    expect(queryByText(RadioButtonLocation.CHOOSE_PLACE_OR_VENUE)).toBeFalsy()
  })

  it(`should have VENUE description's when selected`, async () => {
    mockSearchState.mockReturnValueOnce({
      searchState: {
        locationFilter: { locationType: LocationType.VENUE },
      },
    })
    const { getByText, queryByText } = await renderLocation()
    expect(queryByText(RadioButtonLocation.EVERYWHERE)).toBeFalsy()
    expect(queryByText(RadioButtonLocation.AROUND_ME)).toBeFalsy()
    expect(getByText(RadioButtonLocation.CHOOSE_PLACE_OR_VENUE)).toBeTruthy()
  })

  it(`should have PLACE description's when selected`, async () => {
    mockSearchState.mockReturnValueOnce({
      searchState: {
        locationFilter: { locationType: LocationType.PLACE },
      },
    })
    const { getByText, queryByText } = await renderLocation()
    expect(queryByText(RadioButtonLocation.EVERYWHERE)).toBeFalsy()
    expect(queryByText(RadioButtonLocation.AROUND_ME)).toBeFalsy()
    expect(getByText(RadioButtonLocation.CHOOSE_PLACE_OR_VENUE)).toBeTruthy()
  })

  it('should open modal when clicked', async () => {
    const mockShowModal = jest.fn()
    jest.spyOn(useModalAPI, 'useModal').mockReturnValueOnce({
      visible: true,
      showModal: mockShowModal,
      hideModal: jest.fn(),
      toggleModal: jest.fn(),
    })
    const { getAllByText } = await renderLocation()
    fireEvent.press(getAllByText(RadioButtonLocation.EVERYWHERE)[0])
    expect(mockShowModal).toBeCalledTimes(1)
  })
})

async function renderLocation() {
  const renderAPI = render(<Location />)
  await superFlushWithAct()
  return renderAPI
}
