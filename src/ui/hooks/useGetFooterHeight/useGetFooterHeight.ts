import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

export const useGetFooterHeight = (footerHeight: number) => {
  const { bottom } = useCustomSafeInsets()

  return footerHeight + bottom + 1
}
