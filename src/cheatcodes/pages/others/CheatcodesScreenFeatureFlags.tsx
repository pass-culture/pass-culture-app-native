import React from 'react'
import { FlatList } from 'react-native'
import styled from 'styled-components/native'

import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { useFeatureFlagAll } from 'cheatcodes/hooks/useFeatureFlagAll'
import { Separator } from 'ui/components/Separator'
import { TypoDS, getSpacing } from 'ui/theme'

export const CheatcodesScreenFeatureFlags = () => {
  const featureFlags = useFeatureFlagAll()
  const featureFlagsArray = Object.entries(featureFlags)

  return (
    <CheatcodesTemplateScreen title="Feature Flags 🏳️" flexDirection="column">
      <TypoDS.BodyItalicAccent>
        Nombre de feature flags&nbsp;: {featureFlagsArray.length}
      </TypoDS.BodyItalicAccent>
      <StyledSeparator />
      <FlatList
        data={featureFlagsArray}
        keyExtractor={([featureFlag]) => featureFlag}
        renderItem={({ item: [featureFlag, isActive] }) => (
          <StyledFeatureFlag>
            <TypoDS.Body numberOfLines={1}>{featureFlag}</TypoDS.Body>
            <StyledTitle4 active={!!isActive}>{isActive ? 'Actif' : 'Inactif'}</StyledTitle4>
          </StyledFeatureFlag>
        )}
        ItemSeparatorComponent={() => <StyledSeparator />}
      />
    </CheatcodesTemplateScreen>
  )
}

const StyledFeatureFlag = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
})

const StyledTitle4 = styled(TypoDS.Title4)<{ active: boolean }>(({ theme, active }) => ({
  color: active ? theme.colors.greenValid : theme.colors.error,
}))

const StyledSeparator = styled(Separator.Horizontal)({
  marginVertical: getSpacing(2),
})
