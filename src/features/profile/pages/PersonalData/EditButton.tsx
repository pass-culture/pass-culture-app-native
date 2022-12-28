import React from 'react'

import { ButtonQuaternaryPrimary } from 'ui/components/buttons/ButtonQuaternaryPrimary'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { InternalNavigationProps } from 'ui/components/touchableLink/types'
import { EditPen } from 'ui/svg/icons/EditPen'

type EditButtonProps = {
  navigateTo: InternalNavigationProps['navigateTo']
  wording: string
  accessibilityLabel?: string
  onPress?: () => void
}

export const EditButton = ({
  navigateTo,
  onPress,
  wording,
  accessibilityLabel,
}: EditButtonProps) => (
  <InternalTouchableLink
    as={ButtonQuaternaryPrimary}
    navigateTo={navigateTo}
    onBeforeNavigate={onPress}
    wording={wording}
    icon={EditPen}
    accessibilityLabel={accessibilityLabel}
    inline
  />
)
