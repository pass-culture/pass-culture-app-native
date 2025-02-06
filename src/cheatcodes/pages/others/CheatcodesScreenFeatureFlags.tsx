import React from 'react'
import { FlatList } from 'react-native'
import styled from 'styled-components/native'

import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { useFeatureFlagAll } from 'cheatcodes/hooks/useFeatureFlagAll'
import { env } from 'libs/environment/env'
import { ButtonInsideText } from 'ui/components/buttons/buttonInsideText/ButtonInsideText'
import { Separator } from 'ui/components/Separator'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { Spacer, TypoDS, getSpacing } from 'ui/theme'

export const CheatcodesScreenFeatureFlags = () => {
  const featureFlags = useFeatureFlagAll()
  const featureFlagsArray = Object.entries(featureFlags)

  const title = `Feature Flags ${env.ENV} 🏳️`
  const showTestingFeatureFlags = env.ENV !== 'testing'
  const showStagingFeatureFlags = env.ENV !== 'staging'
  const showProductionFeatureFlags = env.ENV !== 'production'

  return (
    <CheatcodesTemplateScreen title={title} flexDirection="column">
      {showTestingFeatureFlags ? (
        <ExternalTouchableLink
          as={ButtonInsideTextBlack}
          buttonHeight="extraSmall"
          icon={ExternalSiteFilled}
          wording="Voir les feature flags testing"
          externalNav={{
            url: 'https://app.testing.passculture.team/cheatcodes/other/feature-flags',
          }}
        />
      ) : null}
      {showStagingFeatureFlags ? (
        <ExternalTouchableLink
          as={ButtonInsideTextBlack}
          buttonHeight="extraSmall"
          icon={ExternalSiteFilled}
          wording="Voir les feature flags staging"
          externalNav={{
            url: 'https://app.staging.passculture.team/cheatcodes/other/feature-flags',
          }}
        />
      ) : null}
      {showProductionFeatureFlags ? (
        <ExternalTouchableLink
          as={ButtonInsideTextBlack}
          buttonHeight="extraSmall"
          icon={ExternalSiteFilled}
          wording="Voir les feature flags production"
          externalNav={{ url: 'https://passculture.app/cheatcodes/other/feature-flags' }}
        />
      ) : null}
      <Spacer.Column numberOfSpaces={6} />
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

const ButtonInsideTextBlack = styled(ButtonInsideText).attrs(({ theme }) => ({
  buttonColor: theme.colors.black,
}))``
