import { GestureResponderEvent } from 'react-native'

import { HandleNavigationWrapperProps } from 'ui/components/touchableLink/types'

export const handleNavigationWrapper = ({
  onBeforeNavigate,
  onAfterNavigate,
  handleNavigation,
}: HandleNavigationWrapperProps) => {
  const onClick = async (event: GestureResponderEvent) => {
    if (onBeforeNavigate) await onBeforeNavigate(event)
    handleNavigation()
    if (onAfterNavigate) await onAfterNavigate(event)
  }

  return onClick
}
