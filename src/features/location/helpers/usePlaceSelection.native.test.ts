import { Keyboard } from 'react-native'

import { mockLocationState } from 'features/location/fixtures/mockLocationState'
import { mockPlaces } from 'features/location/fixtures/mockPlaces'
import { usePlaceSelection } from 'features/location/helpers/usePlaceSelection'
import { renderHook } from 'tests/utils'

const keyboardDismissSpy = jest.spyOn(Keyboard, 'dismiss')

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

describe('usePlaceSelection', () => {
  it('should call onSetSelectedPlace when onPlaceSelection is called', () => {
    const { result } = renderHook(() => usePlaceSelection(mockLocationState))
    const { onPlaceSelection } = result.current

    onPlaceSelection(mockPlaces[0])

    expect(mockLocationState.onSetSelectedPlace).toHaveBeenCalledWith(mockPlaces[0])
  })

  it('should dismiss the keyboard when onPlaceSelection is called', () => {
    const { result } = renderHook(() => usePlaceSelection(mockLocationState))
    const { onPlaceSelection } = result.current

    onPlaceSelection(mockPlaces[0])

    expect(keyboardDismissSpy).toHaveBeenCalledTimes(1)
  })
})
