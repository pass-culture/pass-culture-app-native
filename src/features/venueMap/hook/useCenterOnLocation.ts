import { RefObject, useCallback } from 'react'
import { useWindowDimensions } from 'react-native'

import type { Region, Map } from 'libs/maps/maps'
import { getSpacing } from 'ui/theme'

const CENTER_PIN_THRESHOLD = getSpacing(4)

type Params = {
  currentRegion?: Region
  mapViewRef: RefObject<Map | null>
  mapHeight: number
}

export const useCenterOnLocation = ({ currentRegion, mapViewRef, mapHeight }: Params) => {
  const { width } = useWindowDimensions()

  return useCallback(
    async (latitude: number, longitude: number, previewHeight = 0) => {
      if (!currentRegion || !mapViewRef?.current) return

      const region = { ...currentRegion, latitude, longitude }
      const point = await mapViewRef.current.pointForCoordinate({ latitude, longitude })

      const isBehindPreview = point.y > mapHeight - (previewHeight + CENTER_PIN_THRESHOLD)
      const isBehindHeader = point.y < CENTER_PIN_THRESHOLD
      const isBehindRightBorder = point.x > width - CENTER_PIN_THRESHOLD
      const isBehindLeftBorder = point.x < CENTER_PIN_THRESHOLD

      if (isBehindHeader || isBehindRightBorder || isBehindPreview || isBehindLeftBorder) {
        mapViewRef.current.animateToRegion(region)
      }
    },
    [currentRegion, mapViewRef, mapHeight, width]
  )
}
