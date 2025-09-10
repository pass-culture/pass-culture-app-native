import React from 'react'
import { SectionList } from 'react-native'
import styled from 'styled-components/native'

import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import {
  FeatureFlagAll,
  useCheatcodesFeatureFlagQuery,
} from 'cheatcodes/queries/useCheatcodesFeatureFlagQuery'
import { env } from 'libs/environment/env'
import { ButtonInsideTextV2 } from 'ui/components/buttons/buttonInsideText/ButtonInsideTextV2'
import { Separator } from 'ui/components/Separator'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { Typo } from 'ui/theme'

export const CheatcodesScreenFeatureFlags = () => {
  const featureFlags = useCheatcodesFeatureFlagQuery()

  type Section = {
    title: string
    data: { featureFlag: string; isFeatureFlagActive: boolean }[]
  }

  const sections: Section[] = Object.entries(featureFlags)
    .map(([owner, data]) => ({
      title: owner,
      data: data as FeatureFlagAll[], // "as" to avoid typing error
    }))
    .sort((a, b) => a.title.localeCompare(b.title))

  const totalFeatureFlags = sections.reduce((sum, section) => sum + section.data.length, 0)

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
          wording="Voir les feature flags production"
          externalNav={{ url: 'https://passculture.app/cheatcodes/other/feature-flags' }}
        />
      ) : null}

      <NbFeatureFlagText>Nombre de feature flags&nbsp;: {totalFeatureFlags}</NbFeatureFlagText>
      <StyledSeparator />
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.featureFlag}
        renderSectionHeader={({ section: { title, data } }) => (
          <React.Fragment>
            <StyledTitle2>
              {title} ({data.length})
            </StyledTitle2>
          </React.Fragment>
        )}
        renderItem={({ item, index, section }) => (
          <React.Fragment>
            <StyledFeatureFlag isLastItem={index === section.data.length - 1}>
              <Value numberOfLines={1}>{item.featureFlag}</Value>
              <StyledTitle4 active={!!item.isFeatureFlagActive}>
                {item.isFeatureFlagActive ? 'Actif' : 'Inactif'}
              </StyledTitle4>
            </StyledFeatureFlag>
          </React.Fragment>
        )}
        ItemSeparatorComponent={ItemSeparator}
      />
    </CheatcodesTemplateScreen>
  )
}

const NbFeatureFlagText = styled(Typo.BodyItalicAccent)(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.xl,
}))

const StyledTitle2 = styled(Typo.Title2)(({ theme }) => ({
  marginBottom: theme.designSystem.size.spacing.l,
}))

const StyledFeatureFlag = styled.View<{ isLastItem: boolean }>(({ theme, isLastItem }) => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: isLastItem ? theme.designSystem.size.spacing.xxxl : undefined,
}))

const StyledTitle4 = styled(Typo.Title4)<{ active: boolean }>(({ theme, active }) => ({
  color: active ? theme.designSystem.color.text.success : theme.designSystem.color.text.error,
}))

const StyledSeparator = styled(Separator.Horizontal)(({ theme }) => ({
  marginVertical: theme.designSystem.size.spacing.s,
}))

const ButtonInsideTextBlack = styled(ButtonInsideTextV2).attrs(({ theme }) => ({
  color: theme.designSystem.color.text.default,
}))``

const Value = styled(Typo.Body)({
  flexShrink: 1,
})

const ItemSeparator = () => <StyledSeparator />
