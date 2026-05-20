import React from 'react'
import { Keyboard } from 'react-native'

import { usePlacesQuery } from 'libs/place/queries/usePlacesQuery'
import { SuggestedPlace } from 'libs/place/types'
import { LocationSearchInput } from 'shared/location/LocationSearchInput'
import { render, screen, userEvent } from 'tests/utils'

jest.mock('libs/place/queries/usePlacesQuery')
const mockUsePlacesQuery = usePlacesQuery as jest.Mock

const user = userEvent.setup()
const mockSuggestedPlace: SuggestedPlace = {
  label: 'Kourou',
  info: 'Guyane',
  type: 'street',
  geolocation: { longitude: -52.669736, latitude: 5.16186 },
}
mockUsePlacesQuery.mockReturnValue({ data: [mockSuggestedPlace], isLoading: false })

const setSelectedPlace = jest.fn()
const setPlaceQuery = jest.fn()
const onResetPlace = jest.fn()
const dismissSpy = jest.spyOn(Keyboard, 'dismiss')

describe('LocationSearchInput', () => {
  it('should dismiss keyboard when a place is selected', async () => {
    render(
      <LocationSearchInput
        selectedPlace={null}
        setSelectedPlace={setSelectedPlace}
        placeQuery="Kou"
        setPlaceQuery={setPlaceQuery}
        onResetPlace={onResetPlace}
      />
    )

    const suggestedPlace = await screen.findByText('Kourou')
    await user.press(suggestedPlace)

    expect(setSelectedPlace).toHaveBeenCalledWith(mockSuggestedPlace)
    expect(dismissSpy).toHaveBeenCalledTimes(1)
  })
})
