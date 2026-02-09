import React, { FunctionComponent } from 'react'
import { View } from 'react-native'

import { getProfilePropConfig } from 'features/navigation/navigators/ProfileStackNavigator/getProfilePropConfig'
import { ProfileStackRouteName } from 'features/navigation/navigators/ProfileStackNavigator/types'
import { StyledSectionRow } from 'features/profile/components/SectionRowWithPaddingVertical/SectionRowWithPaddingVertical'
import { ExternalSite } from 'ui/svg/icons/ExternalSite'
import { AccessibleIcon } from 'ui/svg/icons/types'

type InternalNavButton = {
  title: string
  screen: ProfileStackRouteName
  icon: FunctionComponent<AccessibleIcon>
  params?: Record<string, unknown>
  externalNav?: never
  component?: never
  key?: never
}

type ExternalNavButton = {
  title: string
  externalNav: { url: string }
  params?: never
  screen?: never
  icon?: never
  component?: never
  key?: never
}

type Component = {
  component: React.ReactNode
  key: string
  title?: string
  params?: never
  screen?: never
  externalNav?: never
  icon?: never
}

export type SectionItem = InternalNavButton | ExternalNavButton | Component

const isComponent = (item: SectionItem): item is Component => 'component' in item
const isInternalButton = (item: SectionItem): item is InternalNavButton => 'screen' in item
const isExternalButton = (item: SectionItem): item is ExternalNavButton => 'externalNav' in item

export const createProfileContent = (config: SectionItem): React.ReactNode => {
  if (isComponent(config)) {
    return <View key={config.key}>{config.component}</View>
  }

  if (isExternalButton(config)) {
    return (
      <StyledSectionRow
        key={config.title}
        title={config.title}
        type="clickable"
        externalNav={config.externalNav}
        icon={ExternalSite}
      />
    )
  }

  if (isInternalButton(config)) {
    return (
      <StyledSectionRow
        key={config.title}
        title={config.title}
        type="navigable"
        icon={config.icon}
        navigateTo={getProfilePropConfig(config.screen, config.params)}
      />
    )
  }

  return null
}
