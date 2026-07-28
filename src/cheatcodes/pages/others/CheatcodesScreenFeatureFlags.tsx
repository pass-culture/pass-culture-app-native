import React, { useState } from 'react'
import { SectionList } from 'react-native'
import styled from 'styled-components/native'

import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import {
  FeatureFlagAll,
  useCheatcodesFeatureFlagQuery,
} from 'cheatcodes/queries/useCheatcodesFeatureFlagQuery'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { env } from 'libs/environment/env'
import { Separator } from 'ui/components/Separator'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { Link } from 'ui/designSystem/Link/Link'
import { SearchInput } from 'ui/designSystem/SearchInput/SearchInput'
import { Typo } from 'ui/theme'

export const CheatcodesScreenFeatureFlags = () => {
  const featureFlags = useCheatcodesFeatureFlagQuery()
  const [searchValue, setSearchValue] = useState('')
  const resetSearch = () => setSearchValue('')

  type Section = {
    title: string
    data: { featureFlag: string; isFeatureFlagActive: boolean }[]
  }

  const normalizedSearch = searchValue.trim().toLowerCase()

  const sections: Section[] = Object.entries(featureFlags)
    .map(([owner, data]) => {
      const flags = data as FeatureFlagAll[]
      const filteredFlags = flags.filter((item) =>
        item.featureFlag.toLowerCase().includes(normalizedSearch)
      )

      return {
        title: owner,
        data: filteredFlags,
      }
    })
    .filter((section) => section.data.length > 0)
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
          as={Link}
          isInsideText
          color="neutral"
          buttonHeight="extraSmall"
          wording="Voir les feature flags testing"
          externalNav={{
            url: 'https://app.testing.passculture.team/cheatcodes/other/feature-flags',
          }}
          accessibilityRole={AccessibilityRole.LINK}
        />
      ) : null}
      {showStagingFeatureFlags ? (
        <ExternalTouchableLink
          as={Link}
          isInsideText
          color="neutral"
          buttonHeight="extraSmall"
          wording="Voir les feature flags staging"
          externalNav={{
            url: 'https://app.staging.passculture.team/cheatcodes/other/feature-flags',
          }}
          accessibilityRole={AccessibilityRole.LINK}
        />
      ) : null}
      {showProductionFeatureFlags ? (
        <ExternalTouchableLink
          as={Link}
          isInsideText
          color="neutral"
          buttonHeight="extraSmall"
          wording="Voir les feature flags production"
          externalNav={{ url: 'https://passculture.app/cheatcodes/other/feature-flags' }}
          accessibilityRole={AccessibilityRole.LINK}
        />
      ) : null}

      <Container>
        <StyledSearchInput
          label="Rechercher..."
          value={searchValue}
          onChangeText={setSearchValue}
          onClear={resetSearch}
        />
        <Typo.BodyItalicAccent>
          Nombre de feature flags&nbsp;: {totalFeatureFlags}
        </Typo.BodyItalicAccent>
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
      </Container>
    </CheatcodesTemplateScreen>
  )
}

const Container = styled.View(({ theme }) => ({
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

const Value = styled(Typo.Body)({
  flexShrink: 1,
})

const ItemSeparator = () => <StyledSeparator />

const StyledSearchInput = styled(SearchInput).attrs(({ theme }) => ({
  containerStyle: {
    marginBottom: theme.designSystem.size.spacing.s,
  },
}))``
