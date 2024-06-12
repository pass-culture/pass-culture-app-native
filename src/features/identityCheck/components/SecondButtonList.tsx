import React, { FunctionComponent } from 'react'

import { SectionRow } from 'ui/components/SectionRow'
import { InternalNavigationProps } from 'ui/components/touchableLink/types'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { Typo } from 'ui/theme'

interface SecondButtonListProps {
  leftIcon: FunctionComponent<AccessibleIcon>
  label: string
  navigateTo: InternalNavigationProps['navigateTo']
  onBeforeNavigate?: () => void
}

export function SecondButtonList({
  label,
  leftIcon,
  navigateTo,
  onBeforeNavigate,
}: SecondButtonListProps) {
  const renderTitle = (title: string) => <Typo.Caption>{title}</Typo.Caption>

  return (
    <SectionRow
      title={label}
      navigateTo={navigateTo}
      type="navigable"
      renderTitle={renderTitle}
      icon={leftIcon}
      iconSize={24}
      accessibilityLabel={label}
      onPress={onBeforeNavigate}
    />
  )
}
