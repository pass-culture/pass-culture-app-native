import React, { FC, useEffect } from 'react'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'

import { achievementIconMapper } from 'features/profile/api/Achievements/AchievementIconMapper'
import { useLoadAchievement } from 'features/profile/api/Achievements/application/useLoadAchievement'
import { useLoadUserAchievement } from 'features/profile/api/Achievements/application/useLoadUserAchievement'
import { useAchievements } from 'features/profile/pages/Achievements/useAchievements'
import { ProgressBar } from 'ui/components/bars/ProgressBar'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { SecondaryPageWithBlurHeader } from 'ui/pages/SecondaryPageWithBlurHeader'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { getSpacing, TypoDS } from 'ui/theme'

export const Achievements = () => {
  const { badges } = useAchievements()
  const { uniqueColors } = useTheme()
  const { loadAchievements } = useLoadAchievement()
  const { loadUserAchievements } = useLoadUserAchievement()

  useEffect(() => {
    loadAchievements()
    loadUserAchievements()
  }, [loadAchievements, loadUserAchievements])

  return (
    <SecondaryPageWithBlurHeader title="Achievements">
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
                <ProgressBarContainer>
                  <ProgressBar
                    progress={badge.progress}
                    colors={[uniqueColors.brand]}
                    height={2.5}
                  />
                </ProgressBarContainer>
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

const ProgressBarContainer = styled.View({
  flex: 1,
  maxWidth: 100,
})

const BadgesContainer = styled.View({
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: getSpacing(4),
})

type BadgeProps = {
  id: string
  icon: FC<AccessibleIcon>
  isCompleted?: boolean
}

const Badge: FC<BadgeProps> = ({ isCompleted = false, icon: Icon, id }) => {
  const StyledIcon = styled(Icon).attrs(({ theme }) => ({
    size: 48,
    color: isCompleted ? theme.colors.primary : theme.colors.greyDark,
  }))({ width: '100%' })

  return (
    <InternalTouchableLink
      navigateTo={{
        screen: 'AchievementDetails',
        params: { id },
      }}>
      <BadgeContainer isCompleted={isCompleted}>
        <StyledIcon />
      </BadgeContainer>
    </InternalTouchableLink>
  )
}

const BadgeContainer = styled.View<{ isCompleted: boolean }>(({ isCompleted, theme }) => ({
  padding: getSpacing(4),
  border: '1px solid',
  borderRadius: 8,
  backgroundColor: isCompleted ? 'none' : theme.colors.greyMedium,
  alignItems: 'center',
}))