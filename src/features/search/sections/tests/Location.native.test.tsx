import React from 'react'

import { LocationType } from 'features/search/enums'
import { RadioButtonLocation } from 'features/search/pages/LocationModal'
import { initialSearchState } from 'features/search/pages/reducer'
import { Location } from 'features/search/sections/Location'
import { GeoCoordinates } from 'libs/geolocation'
import { render, fireEvent, superFlushWithAct } from 'tests/utils'
import * as useModalAPI from 'ui/components/modals/useModal'

const mockSearchState = jest.fn().mockReturnValue({
  searchState: initialSearchState,
})

jest.mock('features/search/pages/SearchWrapper', () => ({
  useSearch: () => mockSearchState(),
  useStagedSearch: () => ({
    dispatch: jest.fn(),
  }),
}))

const mockPosition: GeoCoordinates | null = { latitude: 2, longitude: 40 }

jest.mock('libs/geolocation/GeolocationWrapper', () => ({
  useGeolocation: () => ({
    position: mockPosition,
  }),
}))

describe('Location component', () => {
  it(`should have EVERYWHERE description's by default`, async () => {
    const { getByText, queryByText } = await renderLocation()
    expect(getByText(RadioButtonLocation.EVERYWHERE)).toBeTruthy()
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
