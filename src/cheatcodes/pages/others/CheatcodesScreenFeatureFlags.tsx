import React from 'react'
import { SectionList } from 'react-native'
import styled from 'styled-components/native'

import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { FeatureFlagAll, useFeatureFlagAllQuery } from 'cheatcodes/queries/useFeatureFlagAllQuery'
import { env } from 'libs/environment/env'
import { ButtonInsideText } from 'ui/components/buttons/buttonInsideText/ButtonInsideText'
import { Separator } from 'ui/components/Separator'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { Spacer, Typo, getSpacing } from 'ui/theme'

export const CheatcodesScreenFeatureFlags = () => {
  const featureFlags = useFeatureFlagAllQuery()

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
      <Typo.BodyItalicAccent>
        Nombre de feature flags&nbsp;: {totalFeatureFlags}
      </Typo.BodyItalicAccent>
      <StyledSeparator />
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.featureFlag}
        renderSectionHeader={({ section: { title, data } }) => (
          <React.Fragment>
            <Typo.Title2>
              {title} ({data.length})
            </Typo.Title2>
            <Spacer.Column numberOfSpaces={5} />
          </React.Fragment>
        )}
        renderItem={({ item, index, section }) => (
          <React.Fragment>
            <StyledFeatureFlag>
              <Typo.Body numberOfLines={1}>{item.featureFlag}</Typo.Body>
              <StyledTitle4 active={!!item.isFeatureFlagActive}>
                {item.isFeatureFlagActive ? 'Actif' : 'Inactif'}
              </StyledTitle4>
            </StyledFeatureFlag>
            {index === section.data.length - 1 ? <Spacer.Column numberOfSpaces={10} /> : null}
          </React.Fragment>
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

const StyledTitle4 = styled(Typo.Title4)<{ active: boolean }>(({ theme, active }) => ({
  color: active ? theme.colors.greenValid : theme.colors.error,
}))

const StyledSeparator = styled(Separator.Horizontal)({
  marginVertical: getSpacing(2),
})

const ButtonInsideTextBlack = styled(ButtonInsideText).attrs(({ theme }) => ({
  buttonColor: theme.colors.black,
}))``
