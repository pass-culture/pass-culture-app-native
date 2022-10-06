import React from 'react'
import { useTheme } from 'styled-components/native'

import { SectionRowContent, SectionRowContentProps } from 'ui/components/SectionRowContent'
import { Touchable } from 'ui/components/touchable/Touchable'
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { InternalOrExternalNavigationProps } from 'ui/components/touchableLink/types'

type SectionRowProps = SectionRowContentProps & Partial<InternalOrExternalNavigationProps>

export function SectionRow({
  navigateTo,
  externalNav,
  onPress,
  accessibilityLabel,
  ...props
}: SectionRowProps) {
  const { activeOpacity } = useTheme()
  const hasNavProps = navigateTo || externalNav
  const touchableProps = {
    activeOpacity: onPress || hasNavProps ? activeOpacity : 1,
    onPress,
    disabled: !onPress && !hasNavProps,
    accessibilityLabel,
  }

  const externalNavProps = externalNav ? { externalNav } : undefined
  const navigationProps = navigateTo ? { navigateTo } : externalNavProps

  if (navigationProps) {
    return (
      <TouchableLink
        onBeforeNavigate={touchableProps.onPress}
        {...navigationProps}
        {...touchableProps}>
        <SectionRowContent {...props} />
      </TouchableLink>
    )
  }
  return (
    <Touchable {...touchableProps}>
      <SectionRowContent {...props} />
    </Touchable>
  )
}
