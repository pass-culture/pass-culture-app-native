import { useRoute } from '@react-navigation/native'
import React, { FC } from 'react'
import styled from 'styled-components/native'

import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { achievementIconMapper } from 'features/profile/api/Achievements/AchievementIconMapper'
import { useAchievementDetails } from 'features/profile/api/Achievements/useAchievementDetails'
import { SecondaryPageWithBlurHeader } from 'ui/pages/SecondaryPageWithBlurHeader'
import { TypoDS } from 'ui/theme'

export const AchievementDetails: FC = () => {
  const {
    params: { id },
  } = useRoute<UseRouteType<'AchievementDetails'>>()

  const achievement = useAchievementDetails(id)

  const Icon = achievementIconMapper[achievement.icon]
  const StyledIcon = Icon
    ? styled(Icon).attrs(({ theme }) => ({
        size: theme.illustrations.sizes.fullPage,
        color: achievement.completed ? 'red' : theme.colors.black,
      }))``
    : null

  return (
    <SecondaryPageWithBlurHeader title="BadgeDetails">
      <Container>
        {StyledIcon ? <StyledIcon /> : null}
        <TypoDS.Title3>{achievement.name}</TypoDS.Title3>
        <TypoDS.Body>{achievement.description}</TypoDS.Body>
        {achievement.completed ? (
          <TypoDS.BodyS>Fait le {achievement.completedAt}</TypoDS.BodyS>
        ) : null}
      </Container>
    </SecondaryPageWithBlurHeader>
  )
}

const Container = styled.View({
  alignItems: 'center',
})
