import { InternalNavigationProps } from 'ui/components/touchableLink/types'
import { TagProps } from 'ui/designSystem/Tag/types'

export type ChronicleCardData = {
  id: number
  title: string
  subtitle: string
  description: string
  date: string
  tagProps?: TagProps
  image?: string | null
  headerNavigateTo?: InternalNavigationProps['navigateTo']
  headerAccessibilityLabel?: string
}
