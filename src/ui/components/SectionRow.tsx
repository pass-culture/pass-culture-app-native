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
  title,
  ...props
}: SectionRowProps) {
  const { activeOpacity } = useTheme()
  const hasNavProps = navigateTo || externalNav
  const label = accessibilityLabel || title
  const externalLabel = `Nouvelle fenêtre\u00a0: ${label}`
  const touchableProps = {
    activeOpacity: onPress || hasNavProps ? activeOpacity : 1,
    onPress,
    disabled: !onPress && !hasNavProps,
    accessibilityLabel: externalNav ? externalLabel : label,
  }

  if (navigateTo) {
    return (
      <InternalTouchableLink
        onBeforeNavigate={touchableProps.onPress}
        navigateTo={navigateTo}
        {...touchableProps}>
        <SectionRowContent title={title} {...props} />
      </InternalTouchableLink>
    )
  }
  if (externalNav) {
    return (
      <ExternalTouchableLink
        onBeforeNavigate={touchableProps.onPress}
        externalNav={externalNav}
        {...touchableProps}>
        <SectionRowContent title={title} {...props} />
      </ExternalTouchableLink>
    )
  }

  return (
    <Touchable {...touchableProps}>
      <SectionRowContent title={title} {...props} />
    </Touchable>
  )
}
