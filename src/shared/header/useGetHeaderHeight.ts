import { useTheme } from 'styled-components/native'

import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

export const useGetHeaderHeight = () => {
  const { top } = useCustomSafeInsets()
  const { designSystem } = useTheme()
  const HEADER_HEIGHT = designSystem.size.spacing.xxxxl
  return HEADER_HEIGHT + top + 1
}
