import React from 'react'
import { Platform, View } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { ArrowFlatList } from 'ui/components/ArrowFlatList'
import { EventCard, EventCardProps } from 'ui/components/eventCard/EventCard'

type Props = {
  data: EventCardProps[]
}

export const EventCardList: React.FC<Props> = ({ data }) => {
  const { designSystem } = useTheme()

  if (Platform.OS === 'web') {
    return (
      <View testID="desktop-event-card-list">
        <ArrowFlatList
          data={data}
          horizontal
          contentContainerStyle={{ gap: designSystem.size.spacing.m }}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }: { item: EventCardProps }) => <EventCard {...item} />}
          keyExtractor={(_, index) => `screening-${index}`}
          ItemSeparatorComponent={FlatListLineSpacer}
        />
      </View>
    )
  }

  const isLastColumn = (index: number) => index >= data.length - 2

  return (
    <ScrollViewContainer
      horizontal
      showsHorizontalScrollIndicator={false}
      testID="mobile-event-card-list">
      {data.map((_event, index) => {
        if (index % 2 === 1) return null
        const topEventCardData = data[index]
        const bottomEventCardData = data[index + 1]
        return (
          <React.Fragment key={JSON.stringify([topEventCardData, bottomEventCardData])}>
            <View>
              {topEventCardData ? (
                <EventCardContainer isLast={isLastColumn(index)} isBottom={false}>
                  <EventCard {...topEventCardData} />
                </EventCardContainer>
              ) : null}
              {bottomEventCardData ? (
                <EventCardContainer isLast={isLastColumn(index)} isBottom>
                  <EventCard {...bottomEventCardData} />
                </EventCardContainer>
              ) : null}
            </View>
          </React.Fragment>
        )
      })}
    </ScrollViewContainer>
  )
}

const EventCardContainer = styled(View)<{ isLast: boolean; isBottom: boolean }>(
  ({ isLast, isBottom, theme }) => ({
    marginTop: isBottom ? theme.designSystem.size.spacing.m : 0,
    marginRight: isLast ? 0 : theme.designSystem.size.spacing.m,
  })
)

const ScrollViewContainer = styled.ScrollView(({ theme }) => ({
  paddingVertical: theme.designSystem.size.spacing.s,
}))

const FlatListLineSpacer = styled.View(({ theme }) => ({
  marginVertical: theme.designSystem.size.spacing.s,
}))
