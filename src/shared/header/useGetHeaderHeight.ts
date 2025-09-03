import { getSpacing } from 'ui/theme'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

export const HEADER_HEIGHT = getSpacing(12)

export const useGetHeaderHeight = () => {
  const { top } = useCustomSafeInsets()
  return HEADER_HEIGHT + top + 1
}
