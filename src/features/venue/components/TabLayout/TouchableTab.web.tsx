import React, { FunctionComponent } from 'react'

import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole.web'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'

type Props = React.ComponentProps<typeof TouchableOpacity> & { selected: boolean }

export const TouchableTab: FunctionComponent<Props> = ({ selected, id, children, ...props }) => {
  return (
    <TouchableOpacity
      // @ts-ignore accessibilitySelected is well handled by react-native-web (only way to set aria-selected)
      accessibilitySelected={selected}
      // Only the selected tab is focusable, because we should use arrow keys to navigate though the tabs
      // https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/tab_role#keyboard_interaction
      focusable={selected}
      nativeID={id}
      accessibilityRole={AccessibilityRole.TAB}
      {...props}>
      {children}
    </TouchableOpacity>
  )
}
