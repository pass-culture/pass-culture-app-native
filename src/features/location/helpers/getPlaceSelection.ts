import { Keyboard } from 'react-native'

import { LocationState } from 'features/location/types'
import { SuggestedPlace } from 'libs/place/types'

type Params = {
  onSetSelectedPlace: LocationState['onSetSelectedPlace']
}

export const getPlaceSelection = ({ onSetSelectedPlace }: Params) => {
  const onPlaceSelection = (place: SuggestedPlace) => {
    onSetSelectedPlace(place)
    Keyboard.dismiss()
  }

  return { onPlaceSelection }
}
