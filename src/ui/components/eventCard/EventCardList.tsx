import React, { useState } from 'react'
import { FlatList, View } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { Referrals } from 'features/navigation/navigators/RootNavigator/types'
import { EVENT_CARD_WIDTH, EventCard, EventCardProps } from 'ui/components/eventCard/EventCard'

type Props = {
  data: EventCardProps[]
  analyticsFrom?: Referrals
  offerId?: number
}

export const EventCardList: React.FC<Props> = ({ data, analyticsFrom, offerId }) => {
  const [webViewWidth, setWebViewWidth] = useState(0)
  const { isDesktopViewport, designSystem } = useTheme()

  const numColumns = Math.max(
    Math.floor(webViewWidth / (EVENT_CARD_WIDTH + designSystem.size.spacing.l)),
    1
  )

  const analyticsParams = { analyticsFrom, offerId }

  if (isDesktopViewport) {
    return (
      <View
        testID="desktop-event-card-list"
        onLayout={(event) => {
          const { width } = event.nativeEvent.layout
          setWebViewWidth(width)
        }}>
        <FlatList
          listAs="ul"
          itemAs="li"
          key={numColumns}
          data={data}
          renderItem={({ item }: { item: EventCardProps }) => (
            <Container>
              <EventCard {...item} {...analyticsParams} />
            </Container>
          )}
          keyExtractor={(item) => JSON.stringify(item)}
          ItemSeparatorComponent={FlatListLineSpacer}
          numColumns={numColumns}
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
                  <EventCard {...topEventCardData} {...analyticsParams} />
                </EventCardContainer>
              ) : null}
              {bottomEventCardData ? (
                <EventCardContainer isLast={isLastColumn(index)} isBottom>
                  <EventCard {...bottomEventCardData} {...analyticsParams} />
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

const Container = styled(View)(({ theme }) => ({ marginRight: theme.designSystem.size.spacing.l }))
