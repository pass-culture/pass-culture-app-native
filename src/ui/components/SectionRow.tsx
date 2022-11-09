import React from 'react'
import { useTheme } from 'styled-components/native'

import { SectionRowContent, SectionRowContentProps } from 'ui/components/SectionRowContent'
import { Touchable } from 'ui/components/touchable/Touchable'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
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

  if (externalNav) {
    return (
      <ExternalTouchableLink
        testID="touchable-link-section-row"
        onBeforeNavigate={touchableProps.onPress}
        externalNav={externalNav}
        {...touchableProps}>
        <SectionRowContent {...props} />
      </ExternalTouchableLink>
    )
  }

  if (navigateTo) {
    return (
      <InternalTouchableLink
        testID="touchable-link-section-row"
        onBeforeNavigate={touchableProps.onPress}
        navigateTo={navigateTo}
        {...touchableProps}>
        <SectionRowContent {...props} />
      </InternalTouchableLink>
    )
  }

  return (
    <Touchable testID="touchable-section-row" {...touchableProps}>
      <SectionRowContent {...props} />
    </Touchable>
  )
}
