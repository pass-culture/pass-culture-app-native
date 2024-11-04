import { useRoute } from '@react-navigation/native'
import React, { FC } from 'react'
// eslint-disable-next-line no-restricted-imports
import { Image } from 'react-native'
import styled from 'styled-components/native'

import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { achievementIconMapper } from 'features/profile/api/Achievements/AchievementIconMapper'
import { useAchievementDetails } from 'features/profile/pages/Achievements/useAchievementDetails'
import { SecondaryPageWithBlurHeader } from 'ui/pages/SecondaryPageWithBlurHeader'
import { getSpacing, TypoDS, Spacer } from 'ui/theme'

export const AchievementDetails: FC = () => {
  const {
    params: { id },
  } = useRoute<UseRouteType<'AchievementDetails'>>()

  const achievement = useAchievementDetails(id)

  if (!achievement) {
    return null
  }

  const Icon = achievementIconMapper[achievement.icon]

  return (
    <SecondaryPageWithBlurHeader title={achievement.name}>
      <Container>
        {Icon ? (
          <IconsWrapper>
            <StyledIcon source={Icon} resizeMode="contain" />
          </IconsWrapper>
        ) : null}
        <Spacer.Column numberOfSpaces={6} />
        <BodyWrapper isCompleted={achievement.completed}>
          {achievement.completed ? (
            <StyledBody>Fait le {achievement.completedAt}</StyledBody>
          ) : (
            <TypoDS.Body>Non débloqué</TypoDS.Body>
          )}
        </BodyWrapper>
        <Spacer.Column numberOfSpaces={4} />
        <TypoDS.Title3>{achievement.name}</TypoDS.Title3>
        <Spacer.Column numberOfSpaces={4} />
        <StyledDescrption>{achievement.description}</StyledDescrption>
      </Container>
    </SecondaryPageWithBlurHeader>
  )
}

const Container = styled.View({
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
})
const IconsWrapper = styled.View({
  alignItems: 'center',
  justifyContent: 'center',
})

const BodyWrapper = styled.View<{ isCompleted: boolean }>(({ isCompleted, theme }) => ({
  backgroundColor: isCompleted ? theme.colors.primary : theme.colors.greyLight,
  paddingHorizontal: getSpacing(2),
  paddingVertical: getSpacing(1),
  borderRadius: getSpacing(1),
}))

const StyledBody = styled(TypoDS.Body)(({ theme }) => ({
  color: theme.colors.white,
}))

const StyledIcon = styled(Image)({
  position: 'absolute',
  height: getSpacing(40),
  width: getSpacing(40),
})

const StyledDescrption = styled(TypoDS.Body)({
  textAlign: 'center',
})
