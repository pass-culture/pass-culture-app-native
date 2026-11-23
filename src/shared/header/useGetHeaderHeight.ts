import { useTheme } from 'styled-components/native'

import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

export const useGetHeaderHeightDS = () => {
  const { designSystem } = useTheme()
  return designSystem.size.spacing['4xl']
}

export const useGetHeaderHeight = () => {
  const { top } = useCustomSafeInsets()
  const HEADER_HEIGHT = useGetHeaderHeightDS()
  return HEADER_HEIGHT + top + 1
}
