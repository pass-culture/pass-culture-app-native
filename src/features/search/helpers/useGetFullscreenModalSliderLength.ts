import { useTheme } from 'styled-components'

export function useGetFullscreenModalSliderLength(hasFormWidthLimit = true) {
  const { isDesktopViewport, appContentWidth, forms, slider, modal } = useTheme()
  const baseSliderContainerWidth = isDesktopViewport ? modal.desktopMaxWidth : appContentWidth
  /**
   * This hack is used to avoid the slider to be cropped.
   * FIXME(PC-17652): We should create a slider that automatically scales ? Without defining any width
   */
  const modalHorizontalSpacing = modal.spacing.MD * 2

  const nonDesktopWidth = hasFormWidthLimit
    ? Math.min(appContentWidth, forms.maxWidth + modalHorizontalSpacing)
    : appContentWidth

  const fixedBaseSliderContainerWidth = isDesktopViewport
    ? baseSliderContainerWidth
    : nonDesktopWidth

  const sliderLength = fixedBaseSliderContainerWidth - modalHorizontalSpacing - slider.markerSize

  return { sliderLength }
}
