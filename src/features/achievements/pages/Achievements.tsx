import { useRoute } from '@react-navigation/native'
import React, { FC, useEffect } from 'react'
import { View } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'

import { AchievementEnum } from 'api/gen'
import { Achievement } from 'features/achievements/components/Achievement'
import {
  achievementCategoryDisplayTitles,
  achievementData,
} from 'features/achievements/data/AchievementData'
import { useAchievements } from 'features/achievements/hooks/useAchievements'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { ProgressBar } from 'ui/components/bars/ProgressBar'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { SecondaryPageWithBlurHeader } from 'ui/pages/SecondaryPageWithBlurHeader'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { getSpacing, TypoDS } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

const emptyAchievement = {
  name: 'empty' as AchievementEnum,
  isCompleted: false,
  illustration: null as unknown as FC<AccessibleIcon>,
  title: '',
  description: '',
}

export const Achievements = () => {
  const {
    params: { from },
  } = useRoute<UseRouteType<'Achievements'>>()
  const { user } = useAuthContext()
  const { uniqueColors } = useTheme()
  const { categories, track } = useAchievements({
    achievements: achievementData,
    completedAchievements: user?.achievements || [],
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
            <ViewGap gap={4} key={category.name}>
              <AchievementsGroupeHeader>
                <View>
                  <TypoDS.Title4 {...getHeadingAttrs(2)}>
                    {achievementCategoryDisplayTitles[category.name]}
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
                keyExtractor={(item) => item.name}
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
                      name={item.name}
                      title={item.title}
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
