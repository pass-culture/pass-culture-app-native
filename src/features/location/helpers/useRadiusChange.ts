import { useCallback } from 'react'

import { LocationState } from 'features/location/types'

type Props = {
  visible: boolean
} & LocationState

export const useRadiusChange = ({ visible, ...props }: Props) => {
  const { setTempAroundPlaceRadius, setTempAroundMeRadius } = props

  const onTempAroundRadiusPlaceValueChange = useCallback(
    (newValues: number[]) => {
      if (visible) {
        // @ts-expect-error: because of noUncheckedIndexedAccess
        setTempAroundPlaceRadius(newValues[0])
      }
    },
    [visible, setTempAroundPlaceRadius]
  )

  const onTempAroundMeRadiusValueChange = useCallback(
    (newValues: number[]) => {
      if (visible) {
        // @ts-expect-error: because of noUncheckedIndexedAccess
        setTempAroundMeRadius(newValues[0])
      }
    },
    [visible, setTempAroundMeRadius]
  )

  return { onTempAroundRadiusPlaceValueChange, onTempAroundMeRadiusValueChange }
}
