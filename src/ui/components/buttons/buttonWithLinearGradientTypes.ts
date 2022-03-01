export interface ButtonWithLinearGradientProps {
  children?: never
  wording: string
  onPress: (() => void) | (() => Promise<void>) | undefined
  isDisabled?: boolean
  isExternal?: boolean
  type?: 'button' | 'reset' | 'submit'
  className?: string
  name?: string
}
