import { TagVariant } from 'ui/components/Tag/types'

export type AccessibilityActionItem = {
  id: string
  text?: string
  tag: { label: string; variant: TagVariant }
  customContent?: React.ReactNode
}
