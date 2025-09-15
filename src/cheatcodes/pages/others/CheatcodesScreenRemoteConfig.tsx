import { isPlainObject } from 'lodash'
import React from 'react'
import { FlatList } from 'react-native'
import styled from 'styled-components/native'

import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { env } from 'libs/environment/env'
import { useRemoteConfigQuery } from 'libs/firebase/remoteConfig/queries/useRemoteConfigQuery'
import { GenericRemoteConfig } from 'libs/firebase/remoteConfig/remoteConfig.types'
import { LinkInsideText } from 'ui/components/buttons/linkInsideText/LinkInsideText'
import { Separator } from 'ui/components/Separator'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { Typo, getSpacing } from 'ui/theme'

const ConfigItem = ({ label, value }: { label: string; value: GenericRemoteConfig }) => (
  <React.Fragment>
    <Typo.Title4>{label}:</Typo.Title4>
    <Typo.Body>{JSON.stringify(value, null, 2)}</Typo.Body>
  </React.Fragment>
)

export const CheatcodesScreenRemoteConfig = () => {
  const { data: remoteConfig } = useRemoteConfigQuery()

  const sortedRemoteConfigEntries = Object.entries(remoteConfig).sort(([keyA], [keyB]) =>
    keyA.localeCompare(keyB)
  ) as unknown as [string, GenericRemoteConfig][]

  const renderConfigItem = ({ item }: { item: [string, GenericRemoteConfig] }) => {
    const [label, value] = item

    if (Array.isArray(value)) {
      return (
        <React.Fragment>
          <ConfigItem label={label} value={value} />
          <FlatList
            data={value}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => <Typo.Body>{JSON.stringify(item)}</Typo.Body>}
          />
        </React.Fragment>
      )
    } else if (isPlainObject(value)) {
      return <ConfigItem label={label} value={value} />
    } else {
      return <ConfigItem label={label} value={value} />
    }
  }

  const title = `Remote config ${env.ENV} 📊`
  const showTestingFeatureFlags = env.ENV !== 'testing'
  const showStagingFeatureFlags = env.ENV !== 'staging'
  const showProductionFeatureFlags = env.ENV !== 'production'

  return (
    <CheatcodesTemplateScreen title={title} flexDirection="column">
      {showTestingFeatureFlags ? (
        <ExternalTouchableLink
          as={LinkInsideTextBlack}
          buttonHeight="extraSmall"
          wording="Voir les feature flags testing"
          externalNav={{
            url: 'https://app.testing.passculture.team/cheatcodes/other/remote-config',
          }}
          accessibilityRole={AccessibilityRole.LINK}
        />
      ) : null}
      {showStagingFeatureFlags ? (
        <ExternalTouchableLink
          as={LinkInsideTextBlack}
          buttonHeight="extraSmall"
          wording="Voir les feature flags staging"
          externalNav={{
            url: 'https://app.staging.passculture.team/cheatcodes/other/remote-config',
          }}
          accessibilityRole={AccessibilityRole.LINK}
        />
      ) : null}
      {showProductionFeatureFlags ? (
        <ExternalTouchableLink
          as={LinkInsideTextBlack}
          buttonHeight="extraSmall"
          wording="Voir les feature flags production"
          externalNav={{ url: 'https://passculture.app/cheatcodes/other/remote-config' }}
          accessibilityRole={AccessibilityRole.LINK}
        />
      ) : null}

      <FlatList
        data={sortedRemoteConfigEntries}
        keyExtractor={([label]) => label}
        renderItem={renderConfigItem}
        ItemSeparatorComponent={ItemSeparator}
        contentContainerStyle={{ marginTop: getSpacing(6) }}
      />
    </CheatcodesTemplateScreen>
  )
}

const StyledSeparator = styled(Separator.Horizontal)(({ theme }) => ({
  marginVertical: theme.designSystem.size.spacing.s,
}))

const LinkInsideTextBlack = styled(LinkInsideText).attrs(({ theme }) => ({
  color: theme.designSystem.color.text.default,
}))``

const ItemSeparator = () => <StyledSeparator />
