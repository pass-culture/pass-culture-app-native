import React from 'react'
import { FlatList } from 'react-native'
import styled from 'styled-components/native'

import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { CheatcodesABTestRow } from 'cheatcodes/pages/others/CheatcodesABTest/CheatcodesABTestRow'
import { CheatcodeHeaderABTest } from 'cheatcodes/pages/others/CheatcodesABTest/CheatcodesHeaderABTest'
import { getCheatcodesHookConfig } from 'features/navigation/CheatcodesStackNavigator/getCheatcodesHookConfig'
import { useGoBack } from 'features/navigation/useGoBack'
import { useForcedCount } from 'shared/useABSegment/abTestOverrideStore'
import { AB_TESTS_REGISTRY } from 'shared/useABSegment/abTestRegistry'
import { Separator } from 'ui/components/Separator'

export function CheatcodesScreenABTest(): React.JSX.Element {
  const { goBack } = useGoBack(...getCheatcodesHookConfig('CheatcodesMenu'))
  const forcedCount = useForcedCount()
  const total = AB_TESTS_REGISTRY.length

  return (
    <CheatcodesTemplateScreen title="Cheatcodes AB Test" onGoBack={goBack}>
      <CheatcodeHeaderABTest forcedCount={forcedCount} total={total} />
      <StyledSeparator />
      <FlatList
        data={AB_TESTS_REGISTRY}
        keyExtractor={(test) => test.id}
        renderItem={({ item }) => <CheatcodesABTestRow item={item} />}
        ItemSeparatorComponent={StyledSeparator}
        scrollEnabled={false}
      />
    </CheatcodesTemplateScreen>
  )
}

const StyledSeparator = styled(Separator.Horizontal)(({ theme }) => ({
  marginVertical: theme.designSystem.size.spacing.s,
  color: theme.designSystem.color.background.default,
}))
