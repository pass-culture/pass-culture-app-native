import { useState } from 'react'

import { SuggestedPlace } from 'libs/place/types'

export const usePlace = () => {
  const [place, setPlace] = useState<SuggestedPlace | null>(null)
  const [placeQuery, setPlaceQuery] = useState('')
  const [selectedPlace, setSelectedPlace] = useState<SuggestedPlace | null>(null)

  const onResetPlace = () => {
    setSelectedPlace(null)
    setPlaceQuery('')
  }

  return {
    place,
    setPlace,
    onResetPlace,
    selectedPlace,
    setSelectedPlace,
    placeQuery,
    setPlaceQuery,
  }
}
