import { FunctionComponent, ReactElement } from 'react'
import { ViewProps } from 'react-native'

import { ColorsType, TextColorKey } from 'theme/types'
import { AccessibleIcon } from 'ui/svg/icons/types'

export enum TagVariant {
  DEFAULT = 'default',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
  NEW = 'new',
  BOOKCLUB = 'bookclub',
  CINECLUB = 'cineclub',
  HEADLINE = 'headline',
  LIKE = 'like',
}

export type TagProps = ViewProps & {
  label: string
  variant?: TagVariant
  Icon?: FunctionComponent<AccessibleIcon> | ReactElement
}

export type TagColorStyles = {
  backgroundColor: ColorsType
  iconColor: ColorsType
  labelColor: TextColorKey
  iconSize: number
}
