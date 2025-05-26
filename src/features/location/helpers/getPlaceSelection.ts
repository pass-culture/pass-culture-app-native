import { Keyboard } from 'react-native'

import { LocationState } from 'features/location/types'
import { SuggestedPlace } from 'libs/place/types'

type Props = LocationState

export const getPlaceSelection = ({ onSetSelectedPlace }: Props) => {
  const onPlaceSelection = (place: SuggestedPlace) => {
    onSetSelectedPlace(place)
    Keyboard.dismiss()
  }

  return { onPlaceSelection }
}
