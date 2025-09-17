import { TagVariant } from 'ui/designSystem/Tag/types'

export type AccessibilityActionItem = {
  text: string
  tag: { label: string; variant: TagVariant }
  customContent?: React.ReactNode
}
