import { useRoute } from '@react-navigation/native'
import React, { FC, useEffect } from 'react'
import { Image } from 'react-native'
import styled from 'styled-components/native'

import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { achievementIconMapper } from 'features/profile/api/Achievements/AchievementIconMapper'
import { useLoadAchievement } from 'features/profile/api/Achievements/application/useLoadAchievement'
import { useLoadUserAchievement } from 'features/profile/api/Achievements/application/useLoadUserAchievement'
import { useAchievementDetails } from 'features/profile/pages/Achievements/useAchievementDetails'
import { SecondaryPageWithBlurHeader } from 'ui/pages/SecondaryPageWithBlurHeader'
import { getSpacing, TypoDS, Spacer } from 'ui/theme'

import ColoredBackground from './assets/Fond_de_couleur.png'

export const AchievementDetails: FC = () => {
  const {
    params: { id },
  } = useRoute<UseRouteType<'AchievementDetails'>>()
  const { loadAchievements } = useLoadAchievement()
  const { loadUserAchievements } = useLoadUserAchievement()

  const achievement = useAchievementDetails(id)

  useEffect(() => {
    loadAchievements()
    loadUserAchievements()
  }, [loadAchievements, loadUserAchievements])

  if (!achievement) {
    return null
  }

  const Icon = achievementIconMapper[achievement.icon]

  return (
    <SecondaryPageWithBlurHeader title={achievement.name}>
      <Container>
        {Icon ? (
          <IconsWrapper>
            <StyledImage source={ColoredBackground} resizeMode="contain" />
            <StyledIcon source={Icon} resizeMode="contain" />
          </IconsWrapper>
        ) : null}
        <Spacer.Column numberOfSpaces={6} />
        <BodyWrapper isCompleted={achievement.completed}>
          {achievement.completed ? (
            <StyledBody>Fait le {achievement.completedAt}</StyledBody>
          ) : (
            <TypoDS.BodySemiBoldS>Non débloqué</TypoDS.BodySemiBoldS>
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

const StyledImage = styled(Image)({
  height: getSpacing(60),
  width: getSpacing(60),
})

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

const StyledBody = styled(TypoDS.BodySemiBoldS)(({ theme }) => ({
  color: theme.colors.white,
}))

const StyledIcon = styled(Image)({
  position: 'absolute',
  height: getSpacing(50),
  width: getSpacing(50),
})

const StyledDescrption = styled(TypoDS.Body)({
  textAlign: 'center',
})
