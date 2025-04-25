import { InternalNavigationProps } from 'ui/components/touchableLink/types'

export type MarketingBlockProps = {
  navigateTo: InternalNavigationProps['navigateTo']
  onBeforeNavigate?: () => void
  accessibilityLabel?: string
  backgroundImageUrl?: string
  AttachedCardComponent: React.ReactNode
  withGradient?: boolean
  gradientHeight?: string
}
