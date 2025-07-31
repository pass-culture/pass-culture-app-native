import React, { useState } from 'react'
import { View, FlatList } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { Referrals } from 'features/navigation/RootNavigator/types'
import { EventCard, EventCardProps, EVENT_CARD_WIDTH } from 'ui/components/eventCard/EventCard'
import { Spacer, getSpacing } from 'ui/theme'

type Props = {
  data: EventCardProps[]
  analyticsFrom?: Referrals
  offerId?: number
}

export const EventCardList: React.FC<Props> = ({ data, analyticsFrom, offerId }) => {
  const [webViewWidth, setWebViewWidth] = useState(0)
  const { isDesktopViewport } = useTheme()

  const numColumns = Math.max(Math.floor(webViewWidth / (EVENT_CARD_WIDTH + getSpacing(4))), 1)

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

  const isLastColumn = (index: number) => {
    if (index === data.length - 1 || index === data.length - 2) return true
    return false
  }

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
              <EventCardContainer isLast={isLastColumn(index)}>
                {/* @ts-expect-error: because of noUncheckedIndexedAccess */}
                <EventCard {...topEventCardData} {...analyticsParams} />
              </EventCardContainer>
              {bottomEventCardData ? (
                <React.Fragment>
                  <Spacer.Column numberOfSpaces={3} />
                  <EventCardContainer isLast={isLastColumn(index)}>
                    <EventCard {...bottomEventCardData} {...analyticsParams} />
                  </EventCardContainer>
                </React.Fragment>
              ) : null}
            </View>
          </React.Fragment>
        )
      })}
      <Spacer.Row numberOfSpaces={6} />
    </ScrollViewContainer>
  )
}

const EventCardContainer = styled(View)<{ isLast: boolean }>(({ isLast }) => ({
  marginRight: isLast ? 0 : getSpacing(3),
}))

const ScrollViewContainer = styled.ScrollView({
  paddingVertical: getSpacing(2),
})
const FlatListLineSpacer = () => <Spacer.Column numberOfSpaces={4} />

const Container = styled(View)({ marginRight: getSpacing(4) })
