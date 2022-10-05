import React from 'react'

import { ButtonQuaternaryPrimary } from 'ui/components/buttons/ButtonQuaternaryPrimary'
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { InternalNavigationProps } from 'ui/components/touchableLink/types'
import { EditPen } from 'ui/svg/icons/EditPen'

type EditButtonProps = {
  navigateTo: InternalNavigationProps['navigateTo']
  wording: string
  testID?: string
  onPress?: () => void
}

export const EditButton = ({ navigateTo, onPress, wording, testID }: EditButtonProps) => (
  <TouchableLink
    as={ButtonQuaternaryPrimary}
    navigateTo={navigateTo}
    onBeforeNavigate={onPress}
    wording={wording}
    testID={testID ?? wording}
    icon={EditPen}
    inline
  />
)
