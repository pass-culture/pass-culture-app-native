import { REM_TO_PX } from 'ui/theme/constants'

export function getLineHeightPx(
  lineHeight: string | number,
  shouldConvertRemToPx: boolean | undefined
): number {
  if (shouldConvertRemToPx && typeof lineHeight === 'string') {
    return parseFloat(lineHeight) * REM_TO_PX
  }
  return typeof lineHeight === 'number' ? lineHeight : parseFloat(lineHeight)
}
