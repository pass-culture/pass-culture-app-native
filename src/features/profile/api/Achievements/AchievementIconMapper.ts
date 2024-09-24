import { FC } from 'react'

import { Info } from 'ui/svg/icons/Info'
import { Profile } from 'ui/svg/icons/Profile'
import { AccessibleIcon } from 'ui/svg/icons/types'

export const achievementIconMapper: Record<string, FC<AccessibleIcon>> = {
  Info: Info,
  Profile: Profile,
}
