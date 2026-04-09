import { ComponentProps } from 'react'

import { WithSmallBadge } from 'ui/components/WithSmallBadge'
import { Button } from 'ui/designSystem/Button/Button'

export const SmallBadgedButton = WithSmallBadge<ComponentProps<typeof Button>>(Button)
