import { useState } from 'react'

import { SuggestedPlace } from 'libs/place/types'

export const usePlace = () => {
  const [placeQuery, setPlaceQuery] = useState('')

  const [selectedPlace, setSelectedPlace] = useState<SuggestedPlace | null>(null)

  const onSetSelectedPlace = (place: SuggestedPlace) => {
    setSelectedPlace(place)
    setPlaceQuery(place.label)
  }

  const onResetPlace = () => {
    setSelectedPlace(null)
    setPlaceQuery('')
  }
  return {
    onResetPlace,
    onSetSelectedPlace,
    selectedPlace,
    setSelectedPlace,
    placeQuery,
    setPlaceQuery,
  }
}
