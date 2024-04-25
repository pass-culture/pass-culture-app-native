import { Keyboard } from 'react-native'

import { LocationState } from 'features/location/types'
import { SuggestedPlace } from 'libs/place/types'

type Props = LocationState

export const usePlaceSelection = ({ ...props }: Props) => {
  const { onSetSelectedPlace } = props

  const onPlaceSelection = (place: SuggestedPlace) => {
    onSetSelectedPlace(place)
    Keyboard.dismiss()
  }

  return { onPlaceSelection }
}
