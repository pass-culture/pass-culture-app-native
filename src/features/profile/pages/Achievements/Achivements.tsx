import React, { FC } from 'react'
import styled from 'styled-components/native'

import { useAchievements } from 'features/profile/api/Achievements/useAchievements'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { SecondaryPageWithBlurHeader } from 'ui/pages/SecondaryPageWithBlurHeader'
import { Info } from 'ui/svg/icons/Info'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { getSpacing, TypoDS } from 'ui/theme'

const iconMapper: Record<string, FC<AccessibleIcon>> = {
  Info: Info,
}

export const Achievements = () => {
  const { badges } = useAchievements()

  return (
    <SecondaryPageWithBlurHeader title="Achievements">
      <AchievementsContainer>
        {badges.map((badge) => (
          <AchievementsGroupe key={badge.category}>
            <TypoDS.Title3>{badge.category}</TypoDS.Title3>
            <BadgesContainer>
              {badge.achievements.map((achievement) => (
                <Badge
                  key={achievement.id}
                  id={achievement.id}
                  icon={iconMapper[achievement.icon]!}
                  isCompleted={achievement.isCompleted}
                />
              ))}
            </BadgesContainer>
          </AchievementsGroupe>
        ))}
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
    size: 50,
    color: isCompleted ? 'red' : theme.colors.black,
  }))({ width: '100%' })

  return (
    <InternalTouchableLink
      navigateTo={{
        screen: 'BadgeDetails',
        params: { badgeId: id },
      }}>
      <BadgeContainer isCompleted={isCompleted}>
        <StyledIcon />
      </BadgeContainer>
    </InternalTouchableLink>
  )
}

const BadgeContainer = styled.View<{ isCompleted: boolean }>(({ isCompleted }) => ({
  padding: getSpacing(4),
  border: '1px solid',
  borderRadius: 8,
  backgroundColor: isCompleted ? 'none' : 'grey',
  alignItems: 'center',
}))
