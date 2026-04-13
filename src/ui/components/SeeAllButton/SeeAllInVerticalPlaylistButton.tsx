import React from 'react'

import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { InternalNavigationProps } from 'ui/components/touchableLink/types'
import { Button } from 'ui/designSystem/Button/Button'

type Props = {
  accessibilityLabel: string
  onBeforeNavigate: () => void
  navigateTo: InternalNavigationProps['navigateTo']
}

export const SeeAllInVerticalPlaylistButton = ({
  accessibilityLabel,
  onBeforeNavigate,
  navigateTo,
}: Props) => (
  <InternalTouchableLink
    as={Button}
    navigateTo={navigateTo}
    onBeforeNavigate={onBeforeNavigate}
    accessibilityLabel={accessibilityLabel}
    wording="Tout voir"
    variant="tertiary"
  />
)
