import React from 'react'

import { accessibilityAndTestId } from 'libs/accessibilityAndTestId.web'
import { ButtonQuaternaryPrimary } from 'ui/components/buttons/ButtonQuaternaryPrimary'
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
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
  <TouchableLink
    {...accessibilityAndTestId(accessibilityLabel || wording)}
    as={ButtonQuaternaryPrimary}
    navigateTo={navigateTo}
    onBeforeNavigate={onPress}
    wording={wording}
    icon={EditPen}
    inline
  />
)
