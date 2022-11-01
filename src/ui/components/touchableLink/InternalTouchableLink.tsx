import { useLinkProps, useNavigation } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'

import { pushFromRef, navigateFromRef } from 'features/navigation/navigationRef'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { TouchableLink2 } from 'ui/components/touchableLink/TouchableLink2'
import { InternalTouchableLinkProps } from 'ui/components/touchableLink/types'

export const InternalTouchableLink: FunctionComponent<InternalTouchableLinkProps> = ({
  navigateTo,
  enableNavigate = true,
  ...rest
}) => {
  const internalLinkProps = useLinkProps({ to: navigateTo ?? '' })
  const { navigate, push } = useNavigation<UseNavigationType>()
  const handleNavigation = () => {
    if (enableNavigate) {
      const { screen, params, fromRef, withPush } = navigateTo
      if (withPush) {
        fromRef ? pushFromRef(screen, params) : push(screen, params)
      } else {
        fromRef ? navigateFromRef(screen, params) : navigate(screen, params)
      }
    }
  }
  return (
    <TouchableLink2 handleNavigation={handleNavigation} linkProps={internalLinkProps} {...rest} />
  )
}
