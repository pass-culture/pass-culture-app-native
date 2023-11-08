import React, { FunctionComponent } from 'react'

import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'

type Props = React.ComponentProps<typeof TouchableOpacity> & { selected: boolean }

export const TouchableTab: FunctionComponent<Props> = ({ selected, children, ...props }) => (
  <TouchableOpacity
    accessibilityRole={AccessibilityRole.TAB}
    accessibilityState={{ selected }}
    {...props}>
    {children}
  </TouchableOpacity>
)
