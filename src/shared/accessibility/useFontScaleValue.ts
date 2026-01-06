import { useGetFontScale } from './useGetFontScale'

// We use 1.5 as threshold because 2.0 font scale is quite extreme and
// would break too much the UI. 1.5 is already a quite zoomed font size
// that can impact the UI but is still acceptable for most of the users.
const FONT_SCALE_ZOOM_THRESHOLD = 1.5

type ZoomedValue<T> = {
  default: T
  at200PercentZoom: T
}

export const useFontScaleValue = <T>({
  default: at100PercentZoom,
  at200PercentZoom,
}: ZoomedValue<T>): T => {
  const { fontScale } = useGetFontScale()
  return fontScale >= FONT_SCALE_ZOOM_THRESHOLD ? at200PercentZoom : at100PercentZoom
}
