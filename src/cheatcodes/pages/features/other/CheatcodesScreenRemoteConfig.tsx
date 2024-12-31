import isPlainObject from 'lodash'
import React from 'react'
import { FlatList } from 'react-native'
import styled from 'styled-components/native'

import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { GenericRemoteConfig } from 'libs/firebase/remoteConfig/remoteConfig.types'
import { useRemoteConfigContext } from 'libs/firebase/remoteConfig/RemoteConfigProvider'
import { Separator } from 'ui/components/Separator'
import { TypoDS, getSpacing } from 'ui/theme'

const ConfigItem = ({ label, value }: { label: string; value: GenericRemoteConfig }) => (
  <React.Fragment>
    <TypoDS.Title4>{label}:</TypoDS.Title4>
    <TypoDS.Body>{JSON.stringify(value, null, 2)}</TypoDS.Body>
  </React.Fragment>
)

export const CheatcodesScreenRemoteConfig = () => {
  const remoteConfig = useRemoteConfigContext()

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
            renderItem={({ item }) => <TypoDS.Body>{JSON.stringify(item)}</TypoDS.Body>}
          />
        </React.Fragment>
      )
    } else if (isPlainObject(value)) {
      return <ConfigItem label={label} value={value} />
    } else {
      return <ConfigItem label={label} value={value} />
    }
  }

  return (
    <CheatcodesTemplateScreen title="Remote config 📊" flexDirection="column">
      <FlatList
        data={sortedRemoteConfigEntries}
        keyExtractor={([label]) => label}
        renderItem={renderConfigItem}
        ItemSeparatorComponent={() => <StyledSeparator />}
      />
    </CheatcodesTemplateScreen>
  )
}

const StyledSeparator = styled(Separator.Horizontal)({
  marginVertical: getSpacing(2),
})
