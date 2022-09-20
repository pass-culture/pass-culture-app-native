import { FunctionComponent } from 'react'

import { AccessibleIcon } from 'ui/svg/icons/types'

type DefinedLeftIconProps = {
  leftIconAccessibilityLabel: string
  leftIcon: FunctionComponent<AccessibleIcon>
  onLeftIconPress: () => void
}
type UndefinedLeftIconProps = {
  leftIconAccessibilityLabel?: never
  leftIcon?: never
  onLeftIconPress?: never
}
type DefinedRightIconProps = {
  rightIconAccessibilityLabel: string
  rightIcon: FunctionComponent<AccessibleIcon>
  onRightIconPress: () => void
}
type UndefinedRightIconProps = {
  rightIconAccessibilityLabel?: never
  rightIcon?: never
  onRightIconPress?: never
}

export type ModalLeftIconProps = DefinedLeftIconProps | UndefinedLeftIconProps
type ModalRightIconProps = DefinedRightIconProps | UndefinedRightIconProps
export type ModalIconProps = ModalLeftIconProps & ModalRightIconProps
