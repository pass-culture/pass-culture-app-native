import React from 'react'

import { ButtonQuaternary } from 'ui/components/buttons/ButtonQuaternary'
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { TouchableLinkProps } from 'ui/components/touchableLink/types'
import { EditPen } from 'ui/svg/icons/EditPen'

type EditButtonProps = {
  navigateTo: TouchableLinkProps['navigateTo']
  wording: string
  testID?: string
  onPress?: () => void
}

export const EditButton = ({ navigateTo, onPress, wording, testID }: EditButtonProps) => (
  <TouchableLink
    as={ButtonQuaternary}
    navigateTo={navigateTo}
    onPress={onPress}
    wording={wording}
    testID={testID ?? wording}
    icon={EditPen}
    inline
  />
)
