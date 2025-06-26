import { AppThemeType } from 'theme'
import { TagProps } from 'ui/components/Tag/types'
import { AccessibleIcon } from 'ui/svg/icons/types'

export type SizeProp = keyof AppThemeType['image']['square']['sizes']

export type CheckboxVariant = 'default' | 'detailed'

export type CheckboxState = 'checked' | 'indeterminate' | 'error' | 'disabled' | 'default'

export type CheckboxDisplay = 'hug' | 'fill'

export type CheckboxAssetProps =
  | {
      variant: 'icon'
      Icon: React.FC<AccessibleIcon>
      disable?: boolean
      src?: never
      size?: never
      text?: never
      tag?: never
    }
  | {
      variant: 'tag'
      tag: TagProps
      disable?: boolean
      src?: never
      size?: never
      text?: never
      Icon?: never
    }
  | {
      variant: 'text'
      text: string
      disable?: boolean
      src?: never
      size?: never
      Icon?: never
      tag?: never
    }
  | {
      variant: 'image'
      src: string
      disable?: boolean
      size?: SizeProp
      Icon?: never
      text?: never
      tag?: never
    }
