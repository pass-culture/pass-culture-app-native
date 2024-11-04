import React, { FC, useEffect } from 'react'
// eslint-disable-next-line no-restricted-imports
import { Image, ImageURISource } from 'react-native'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'

import { achievementIconMapper } from 'features/profile/api/Achievements/AchievementIconMapper'
import { useLoadUserAchievement } from 'features/profile/api/Achievements/application/useLoadUserAchievement'
import { useAchievements } from 'features/profile/pages/Achievements/useAchievements'
import { ProgressBar } from 'ui/components/bars/ProgressBar'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { SecondaryPageWithBlurHeader } from 'ui/pages/SecondaryPageWithBlurHeader'
import { getSpacing, TypoDS } from 'ui/theme'

export const Achievements = () => {
  const { badges } = useAchievements()
  const { uniqueColors } = useTheme()

  const { loadUserAchievements } = useLoadUserAchievement()

  useEffect(() => {
    loadUserAchievements()
  }, [loadUserAchievements])

  return (
    <SecondaryPageWithBlurHeader title="Mes Succès">
      <AchievementsContainer>
        <TypoDS.Title2>Mes Succès</TypoDS.Title2>
        {badges.map((badge) => {
          const remainingAchievementsText = `${badge.remainingAchievements} badge${badge.remainingAchievements > 1 ? 's' : ''} restant`
          return (
            <AchievementsGroupe key={badge.category}>
              <AchievementsGroupeHeader>
                <AchievementsGroupeTitle>
                  <TypoDS.Title4>{badge.category}</TypoDS.Title4>
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
                    icon={achievementIconMapper[achievement.icon]!}
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

const CompletionContainer = styled.View({
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: getSpacing(2),
})

const ProgressBarContainer = styled.View({
  flex: 1,
  maxWidth: 80,
})

const BadgesContainer = styled.View({
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: getSpacing(4),
})

type BadgeProps = {
  id: string
  icon: ImageURISource
  isCompleted?: boolean
}

const Badge: FC<BadgeProps> = ({ isCompleted = false, icon, id }) => {
  return (
    <InternalTouchableLink
      navigateTo={{
        screen: 'AchievementDetails',
        params: { id },
      }}>
      <BadgeContainer isCompleted={isCompleted}>
        <StyledImage source={icon} resizeMode="contain" />
        {isCompleted ? null : <NotCompletedFilter />}
      </BadgeContainer>
    </InternalTouchableLink>
  )
}

const BadgeContainer = styled.View<{ isCompleted: boolean }>({
  padding: getSpacing(4),
  border: '1px solid',
  borderRadius: 8,
  alignItems: 'center',
})

const StyledImage = styled(Image)({
  height: getSpacing(15),
  width: getSpacing(15),
})

const NotCompletedFilter = styled.View({
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
  borderRadius: 8,
})
