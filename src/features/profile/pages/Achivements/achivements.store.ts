import { FC } from 'react'

import { Info } from 'ui/svg/icons/Info'
import { AccessibleIcon } from 'ui/svg/icons/types'

type Achivement = {
  id: string
  name: string
  description: string
  icon: FC<AccessibleIcon>
}

export const achivements: Achivement[] = [
  {
    id: '1',
    name: 'First favorite',
    description: 'Add your first favorite',
    icon: Info,
  },
]
