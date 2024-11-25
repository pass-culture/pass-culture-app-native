import { ComponentProps } from 'react'

import { RoundedButton } from 'ui/components/buttons/RoundedButton'
import { WithSmallBadge } from 'ui/components/WithSmallBadge'

export const SmallBadgedButton = WithSmallBadge<ComponentProps<typeof RoundedButton>>(RoundedButton)
