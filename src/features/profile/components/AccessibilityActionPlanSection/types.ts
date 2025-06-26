import { TagVariant } from 'ui/components/Tag/types'

export type AccessibilityActionItem = {
  text: string
  tag: { label: string; variant: TagVariant }
  customContent?: React.ReactNode
}
