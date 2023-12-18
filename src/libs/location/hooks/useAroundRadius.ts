import { useState } from 'react'

import { DEFAULT_RADIUS } from 'features/search/constants'

export const useAroundRadius = () => {
  const [aroundPlaceRadius, setAroundPlaceRadius] = useState(DEFAULT_RADIUS)
  const [aroundMeRadius, setAroundMeRadius] = useState(DEFAULT_RADIUS)

  return {
    aroundPlaceRadius,
    setAroundPlaceRadius,
    aroundMeRadius,
    setAroundMeRadius,
  }
}
