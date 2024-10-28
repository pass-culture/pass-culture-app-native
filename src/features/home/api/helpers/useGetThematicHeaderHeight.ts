import { useTheme } from 'styled-components/native'

import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

export const useGetThematicHeaderHeight = () => {
  const theme = useTheme()
  const { top } = useCustomSafeInsets()

  return theme.appBarHeight + top
}
