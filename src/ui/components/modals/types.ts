import { FunctionComponent } from 'react'

import { IconInterface } from 'ui/svg/icons/types'

type DefinedLeftIconProps = {
  leftIconAccessibilityLabel: string
  leftIcon: FunctionComponent<IconInterface>
  onLeftIconPress: () => void
}
type UndefinedLeftIconProps = {
  leftIconAccessibilityLabel: undefined
  leftIcon: undefined
  onLeftIconPress: undefined
}
type DefinedRightIconProps = {
  rightIconAccessibilityLabel: string
  rightIcon: FunctionComponent<IconInterface>
  onRightIconPress: () => void
}
type UndefinedRightIconProps = {
  rightIconAccessibilityLabel: undefined
  rightIcon: undefined
  onRightIconPress: undefined
}

export type ModalLeftIconProps = DefinedLeftIconProps | UndefinedLeftIconProps
export type ModalIconProps =
  | (DefinedLeftIconProps & DefinedRightIconProps)
  | (DefinedLeftIconProps & UndefinedRightIconProps)
  | (UndefinedLeftIconProps & DefinedRightIconProps)
  | (UndefinedLeftIconProps & UndefinedRightIconProps)
