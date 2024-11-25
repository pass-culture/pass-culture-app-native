import React, { FC } from 'react'
import { View } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'

import { Badge } from 'features/profile/components/Achievements/Badge'
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

const emptyBadge = {
  id: 'empty' as AchievementId,
  isCompleted: false,
  illustration: null as unknown as FC<AccessibleIcon>,
  name: '',
  description: '',
}

export const Achievements = () => {
  const { uniqueColors } = useTheme()
  const badges = useAchievements({
    achievements: mockAchievements,
    completedAchievements: mockCompletedAchievements,
  })

  return (
    <SecondaryPageWithBlurHeader title="">
      <ViewGap gap={4}>
        <TypoDS.Title2 {...getHeadingAttrs(1)}>Mes Succès</TypoDS.Title2>
        {badges.map((badge) => {
          let sortedAchievements = badge.achievements
          const oddAchievements = sortedAchievements.length % 2 !== 0
          if (oddAchievements) sortedAchievements = [...sortedAchievements, emptyBadge]

          return (
            <ViewGap gap={4} key={badge.category}>
              <AchievementsGroupeHeader>
                <View>
                  <TypoDS.Title4 {...getHeadingAttrs(2)}>
                    {achievementCategoryDisplayNames[badge.category]}
                  </TypoDS.Title4>
                  <StyledBody>{badge.remainingAchievementsText}</StyledBody>
                </View>
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
              <FlatList
                data={sortedAchievements}
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
                    <Badge
                      id={item.id}
                      name={item.name}
                      Illustration={item.illustration}
                      isCompleted={item.isCompleted}
                    />
                  ) : (
                    <EmptyBadge accessible={false} />
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

const EmptyBadge = styled.View({
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
