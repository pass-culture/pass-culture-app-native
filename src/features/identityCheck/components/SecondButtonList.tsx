import React, { FunctionComponent } from 'react'

import { SectionRow } from 'ui/components/SectionRow'
import { InternalNavigationProps } from 'ui/components/touchableLink/types'
import { IconInterface } from 'ui/svg/icons/types'
import { Typo } from 'ui/theme'

interface SecondButtonListProps {
  leftIcon: FunctionComponent<IconInterface>
  label: string
  navigateTo: InternalNavigationProps['navigateTo']
}
export const SecondButtonList: FunctionComponent<SecondButtonListProps> = ({
  label,
  leftIcon,
  navigateTo,
}) => {
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
    />
  )
}
