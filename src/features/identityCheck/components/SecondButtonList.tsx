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
export const SecondButtonList: FunctionComponent<SecondButtonListProps> = ({
  label,
  leftIcon,
  navigateTo,
  onBeforeNavigate,
}) => {
  const renderTitle = (title: string) => <Typo.BodyAccentXs>{title}</Typo.BodyAccentXs>

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
