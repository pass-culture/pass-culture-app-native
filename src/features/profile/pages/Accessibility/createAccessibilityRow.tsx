import React from 'react'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { AccessibilityRowConfig } from 'features/profile/pages/Accessibility/Accessibility'
import { SectionRow } from 'ui/components/SectionRow'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'

export const createAccessibilityRow = (
  config: AccessibilityRowConfig,
  index: number,
  navigate: UseNavigationType['navigate']
) => {
  const noTopMargin = index === 0
  const commonProps = { title: config.title, noTopMargin }
  const isExternalNav = 'externalNav' in config

  return isExternalNav ? (
    <StyledSectionRow
      {...commonProps}
      key={config.title}
      type="clickable"
      externalNav={config.externalNav}
      icon={ExternalSiteFilled}
    />
  ) : (
    <StyledSectionRow
      {...commonProps}
      key={config.title}
      type="navigable"
      onPress={() => navigate('ProfileStackNavigator', { screen: config.screen })}
    />
  )
}

const StyledSectionRow = styled(SectionRow)<{ noTopMargin?: boolean }>(
  ({ noTopMargin, theme }) => ({
    marginBottom: theme.designSystem.size.spacing.xl,
    marginTop: noTopMargin ? 0 : theme.designSystem.size.spacing.xl,
  })
)
