import { Keyboard } from 'react-native'

import { mockLocationState } from 'features/location/fixtures/mockLocationState'
import { mockPlaces } from 'features/location/fixtures/mockPlaces'
import { getPlaceSelection } from 'features/location/helpers/getPlaceSelection'
import { renderHook } from 'tests/utils'

const keyboardDismissSpy = jest.spyOn(Keyboard, 'dismiss')

describe('getPlaceSelection', () => {
  it('should call onSetSelectedPlace when onPlaceSelection is called', () => {
    const { result } = renderHook(() => getPlaceSelection(mockLocationState))
    const { onPlaceSelection } = result.current

    onPlaceSelection(mockPlaces[0])

    expect(mockLocationState.onSetSelectedPlace).toHaveBeenCalledWith(mockPlaces[0])
  })

  it('should dismiss the keyboard when onPlaceSelection is called', () => {
    const { result } = renderHook(() => getPlaceSelection(mockLocationState))
    const { onPlaceSelection } = result.current

    onPlaceSelection(mockPlaces[0])

    expect(keyboardDismissSpy).toHaveBeenCalledTimes(1)
  })
})
