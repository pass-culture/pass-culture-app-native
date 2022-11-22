import { useTheme } from 'styled-components'

export function useGetFullscreenModalSliderLength() {
  const { isDesktopViewport, appContentWidth, forms, slider, modal } = useTheme()
  const baseSliderContainerWidth = isDesktopViewport ? modal.desktopMaxWidth : appContentWidth
  /**
   * This hack is used to avoid the slider to be cropped.
   * FIXME(PC-17652): We should create a slider that automatically scales ? Without defining any width
   */
  const fixedBaseSliderContainerWidth = isDesktopViewport
    ? baseSliderContainerWidth
    : Math.min(appContentWidth, forms.maxWidth + modal.spacing.MD * 2)

  const sliderLength = fixedBaseSliderContainerWidth - modal.spacing.MD * 2 - slider.markerSize

  return { sliderLength }
}
