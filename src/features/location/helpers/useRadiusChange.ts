import { useCallback } from 'react'

import { LocationState } from 'features/location/types'

type Props = {
  setTempAroundPlaceRadius: LocationState['setTempAroundPlaceRadius']
  setTempAroundMeRadius: LocationState['setTempAroundMeRadius']
}

export const useRadiusChange = ({ setTempAroundPlaceRadius, setTempAroundMeRadius }: Props) => {
  const onTempAroundRadiusPlaceValueChange = useCallback(
    (newValues: number[]) => {
      if (newValues?.[0]) {
        setTempAroundPlaceRadius(newValues[0])
      }
    },
    [setTempAroundPlaceRadius]
  )

  const onTempAroundMeRadiusValueChange = useCallback(
    (newValues: number[]) => {
      if (newValues?.[0]) {
        setTempAroundMeRadius(newValues[0])
      }
    },
    [setTempAroundMeRadius]
  )

  return { onTempAroundRadiusPlaceValueChange, onTempAroundMeRadiusValueChange }
}
