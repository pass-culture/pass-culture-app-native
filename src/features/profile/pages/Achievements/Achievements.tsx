import { useRoute } from '@react-navigation/native'
import React, { FC, useEffect } from 'react'
import { View } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'

import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { Achievement } from 'features/profile/components/Achievements/Achievement'
import {
  achievementCategoryDisplayNames,
  AchievementId,
  mockAchievements,
  mockCompletedAchievements,
} from 'features/profile/pages/Achievements/AchievementData'
import { useAchievements } from 'features/profile/pages/Achievements/useAchievements'
import { ProgressBar } from 'ui/components/bars/ProgressBar'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { SecondaryPageWithBlurHeader } from 'ui/pages/SecondaryPageWithBlurHeader'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { getSpacing, TypoDS } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

const emptyAchievement = {
  id: 'empty' as AchievementId,
  isCompleted: false,
  illustration: null as unknown as FC<AccessibleIcon>,
  name: '',
  description: '',
}

export const Achievements = () => {
  const {
    params: { from },
  } = useRoute<UseRouteType<'Achievements'>>()
  const { uniqueColors } = useTheme()
  const { categories, track } = useAchievements({
    achievements: mockAchievements,
    completedAchievements: mockCompletedAchievements,
  })

  useEffect(() => {
    track(from)
  }, [from, track])

  return (
    <SecondaryPageWithBlurHeader title="">
      <ViewGap gap={4}>
        <TypoDS.Title2 {...getHeadingAttrs(1)}>Mes succès</TypoDS.Title2>
        {categories.map((category) => {
          const isOddAchievements = category.achievements.length % 2 !== 0
          const achievements = isOddAchievements
            ? [...category.achievements, emptyAchievement]
            : category.achievements

          return (
            <ViewGap gap={4} key={category.id}>
              <AchievementsGroupeHeader>
                <View>
                  <TypoDS.Title4 {...getHeadingAttrs(2)}>
                    {achievementCategoryDisplayNames[category.id]}
                  </TypoDS.Title4>
                  <StyledBody>{category.remainingAchievementsText}</StyledBody>
                </View>
                <CompletionContainer>
                  <ProgressBarContainer>
                    <ProgressBar
                      progress={category.progress}
                      colors={[uniqueColors.brand]}
                      height={2.5}
                    />
                  </ProgressBarContainer>
                  <TypoDS.BodyS>{category.progressText}</TypoDS.BodyS>
                </CompletionContainer>
              </AchievementsGroupeHeader>
              <FlatList
                data={achievements}
                numColumns={2}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{
                  gap: getSpacing(6),
                  rowGap: getSpacing(6),
                  paddingHorizontal: getSpacing(2),
                }}
                columnWrapperStyle={{
                  gap: getSpacing(6),
                }}
                renderItem={({ item }) =>
                  item.illustration ? (
                    <Achievement
                      id={item.id}
                      name={item.name}
                      Illustration={item.illustration}
                      isCompleted={item.isCompleted}
                    />
                  ) : (
                    <EmptyAchievement accessible={false} />
                  )
                }
              />
            </ViewGap>
          )
        })}
      </ViewGap>
    </SecondaryPageWithBlurHeader>
  )
}

const EmptyAchievement = styled.View({
  flex: 0.5,
})

const StyledBody = styled(TypoDS.BodyAccentXs)(({ theme }) => ({
  color: theme.colors.greySemiDark,
}))

const AchievementsGroupeHeader = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
})

const CompletionContainer = styled(ViewGap).attrs({ gap: 2 })({
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-end',
})

const ProgressBarContainer = styled.View({
  flex: 1,
  maxWidth: getSpacing(20),
})
