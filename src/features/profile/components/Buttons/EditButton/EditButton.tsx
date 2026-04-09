import React from 'react'

import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { InternalNavigationProps } from 'ui/components/touchableLink/types'
import { Button } from 'ui/designSystem/Button/Button'
import { EditPen } from 'ui/svg/icons/EditPen'

type EditButtonProps = {
  wording: string
  accessibilityLabel?: string
  navigateTo?: InternalNavigationProps['navigateTo']
  onPress?: () => void
}

export const EditButton = ({
  navigateTo,
  onPress,
  wording,
  accessibilityLabel,
}: EditButtonProps) => {
  return navigateTo ? (
    <InternalTouchableLink
      as={Button}
      variant="tertiary"
      navigateTo={navigateTo}
      onBeforeNavigate={onPress}
      wording={wording}
      icon={EditPen}
      accessibilityLabel={accessibilityLabel}
      inline
    />
  ) : (
    <TouchableLink
      as={Button}
      variant="tertiary"
      wording={wording}
      icon={EditPen}
      inline
      accessibilityLabel={accessibilityLabel}
      handleNavigation={() => onPress?.()}
    />
  )
}
