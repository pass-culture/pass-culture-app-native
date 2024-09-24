import React, { FC } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { useAchievements } from 'features/profile/pages/Achivements/useAchievements'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { SecondaryPageWithBlurHeader } from 'ui/pages/SecondaryPageWithBlurHeader'
import { Info } from 'ui/svg/icons/Info'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { getSpacing, TypoDS } from 'ui/theme'

const iconMapper: Record<string, FC<AccessibleIcon>> = {
  Info: Info,
}

export const Achivements = () => {
  const { badges } = useAchievements()
  return (
    <SecondaryPageWithBlurHeader title="Achivements">
      <BadgesContainer>
        {badges.map((badge) => (
          <View key={badge.category}>
            <TypoDS.Title3>{badge.category}</TypoDS.Title3>
            {badge.achievements.map((achievement) => (
              <Badge
                key={achievement.id}
                id={achievement.id}
                icon={iconMapper[achievement.icon]!}
                isCompleted={achievement.isCompleted}
              />
            ))}
          </View>
        ))}
      </BadgesContainer>
    </SecondaryPageWithBlurHeader>
  )
}

const BadgesContainer = styled.View({
  flexDirection: 'row',
  gap: getSpacing(4),
  flexWrap: 'wrap',
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
