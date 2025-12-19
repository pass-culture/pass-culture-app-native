import { useNavigation } from '@react-navigation/native'
import React from 'react'
import styled from 'styled-components/native'

import {
  AccessibilityRootStackParamList,
  UseNavigationType,
} from 'features/navigation/RootNavigator/types'
import { env } from 'libs/environment/env'
import { AccessibleUnorderedList } from 'ui/components/accessibility/AccessibleUnorderedList'
import { SectionRow } from 'ui/components/SectionRow'
import { Separator } from 'ui/components/Separator'
import { SecondaryPageWithBlurHeader } from 'ui/pages/SecondaryPageWithBlurHeader'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { getSpacing } from 'ui/theme'

const StyledSectionRow = styled(SectionRow)<{ noTopMargin?: boolean }>(({ noTopMargin }) => ({
  marginBottom: getSpacing(6),
  marginTop: noTopMargin ? 0 : getSpacing(6),
}))

type AccessibilityRowConfig =
  | {
      title: string
      screen: keyof AccessibilityRootStackParamList
      noTopMargin?: boolean
    }
  | {
      title: string
      externalNav: { url: string }
      noTopMargin?: boolean
    }

const sectionConfig: AccessibilityRowConfig[] = [
  {
    title: 'Plan du site',
    screen: 'SiteMapScreen',
    noTopMargin: true,
  },
  {
    title: 'Les engagements du pass Culture',
    externalNav: { url: env.ACCESSIBILITY },
  },
  {
    title: 'Schéma pluriannuel',
    externalNav: { url: env.ACCESSIBILITY_PLAN },
  },
  {
    title: 'Déclaration d’accessibilité - Android',
    screen: 'AccessibilityDeclarationMobileAndroid',
  },
  {
    title: 'Déclaration d’accessibilité - iOS',
    screen: 'AccessibilityDeclarationMobileIOS',
  },
  {
    title: 'Déclaration d’accessibilité - web',
    screen: 'AccessibilityDeclarationWeb',
  },
  {
    title: 'Parcours recommandés - web',
    screen: 'RecommendedPaths',
  },
]

function AccessibilityRow(props: AccessibilityRowConfig) {
  const { navigate } = useNavigation<UseNavigationType>()

  if ('externalNav' in props) {
    return (
      <StyledSectionRow
        title={props.title}
        type="clickable"
        noTopMargin={props.noTopMargin}
        externalNav={props.externalNav}
        icon={ExternalSiteFilled}
      />
    )
  }

  return (
    <StyledSectionRow
      title={props.title}
      type="navigable"
      noTopMargin={props.noTopMargin}
      onPress={() =>
        navigate('ProfileStackNavigator', {
          screen: props.screen,
        })
      }
    />
  )
}

export function Accessibility() {
  return (
    <SecondaryPageWithBlurHeader title="Accessibilité" enableMaxWidth={false}>
      <AccessibleUnorderedList
        items={sectionConfig.map((item) => (
          <AccessibilityRow key={item.title} {...item} />
        ))}
        Separator={<Separator.Horizontal />}
      />
    </SecondaryPageWithBlurHeader>
  )
}
