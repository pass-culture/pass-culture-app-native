import React from 'react'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'

import { Badge } from 'features/profile/components/Achievements/Badge'
import {
  achievementCategoryDisplayNames,
  mockAchievements,
  mockCompletedAchievements,
} from 'features/profile/pages/Achievements/AchievementData'
import { useAchievements } from 'features/profile/pages/Achievements/useAchievements'
import { ProgressBar } from 'ui/components/bars/ProgressBar'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { SecondaryPageWithBlurHeader } from 'ui/pages/SecondaryPageWithBlurHeader'
import { getSpacing, TypoDS } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

export const Achievements = () => {
  const { uniqueColors } = useTheme()
  const { badges } = useAchievements({
    achievements: mockAchievements,
    completedAchievements: mockCompletedAchievements,
  })

  return (
    <SecondaryPageWithBlurHeader title="">
      <AchievementsContainer>
        <TypoDS.Title2>Mes Succès</TypoDS.Title2>
        {badges.map((badge) => {
          const remainingAchievementsText = `${badge.remainingAchievements} badge${badge.remainingAchievements > 1 ? 's' : ''} restant`
          return (
            <AchievementsGroupe key={badge.category}>
              <AchievementsGroupeHeader>
                <AchievementsGroupeTitle>
                  <TypoDS.Title4 {...getHeadingAttrs(2)}>
                    {achievementCategoryDisplayNames[badge.category]}
                  </TypoDS.Title4>
                  <TypoDS.BodyS>{remainingAchievementsText}</TypoDS.BodyS>
                </AchievementsGroupeTitle>

                <CompletionContainer>
                  <ProgressBarContainer>
                    <ProgressBar
                      progress={badge.progress}
                      colors={[uniqueColors.brand]}
                      height={2.5}
                    />
                  </ProgressBarContainer>
                  <TypoDS.BodyS>{badge.progressText}</TypoDS.BodyS>
                </CompletionContainer>
              </AchievementsGroupeHeader>
              <BadgesContainer>
                {badge.achievements.map((achievement) => (
                  <Badge
                    key={achievement.id}
                    id={achievement.id}
                    Illustration={achievement.illustration}
                    isCompleted={achievement.isCompleted}
                  />
                ))}
              </BadgesContainer>
            </AchievementsGroupe>
          )
        })}
      </AchievementsContainer>
    </SecondaryPageWithBlurHeader>
  )
}

const AchievementsContainer = styled.View({
  gap: getSpacing(4),
})

const AchievementsGroupe = styled.View({
  gap: getSpacing(4),
})

const AchievementsGroupeHeader = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
})

const AchievementsGroupeTitle = styled.View({})

const CompletionContainer = styled(ViewGap).attrs({ gap: 2 })({
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-end',
})

const ProgressBarContainer = styled.View({
  flex: 1,
  maxWidth: 80,
})

const BadgesContainer = styled(ViewGap).attrs({ gap: 6 })({
  flexDirection: 'row',
  flexWrap: 'wrap',
  paddingHorizontal: getSpacing(2),
})
