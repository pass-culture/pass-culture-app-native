import { useTheme } from 'styled-components/native'

import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

export const useGetThematicHeaderHeight = () => {
  const { appBarHeight } = useTheme()
  const { top } = useCustomSafeInsets()

  return appBarHeight + top
}
