import { Keyboard } from 'react-native'

import { mockLocationState } from 'features/location/fixtures/mockLocationState'
import { mockPlaces } from 'features/location/fixtures/mockPlaces'
import { getPlaceSelection } from 'features/location/helpers/getPlaceSelection'

const keyboardDismissSpy = jest.spyOn(Keyboard, 'dismiss')

describe('getPlaceSelection', () => {
  it('should call onSetSelectedPlace when onPlaceSelection is called', () => {
    const { onPlaceSelection } = getPlaceSelection(mockLocationState)

    onPlaceSelection(mockPlaces[0])

    expect(mockLocationState.onSetSelectedPlace).toHaveBeenCalledWith(mockPlaces[0])
  })

  it('should dismiss the keyboard when onPlaceSelection is called', () => {
    const { onPlaceSelection } = getPlaceSelection(mockLocationState)

    onPlaceSelection(mockPlaces[0])

    expect(keyboardDismissSpy).toHaveBeenCalledTimes(1)
  })
})
