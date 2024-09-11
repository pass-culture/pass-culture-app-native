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
        onLayout={(event) => {
          const { width } = event.nativeEvent.layout
          setWebViewWidth(width)
        }}>
        <StyledFlatList
          listAs="ul"
          itemAs="li"
          key={numColumns}
          data={data}
          renderItem={({ item }: { item: EventCardProps }) => (
            <React.Fragment>
              <EventCard {...item} {...analyticsParams} />
              <Spacer.Row numberOfSpaces={4} />
            </React.Fragment>
          )}
          keyExtractor={(item) => JSON.stringify(item)}
          ItemSeparatorComponent={FlatListLineSpacer}
          numColumns={numColumns}
        />
      </View>
    )
  }

  return (
    <Container horizontal showsHorizontalScrollIndicator={false}>
      <Spacer.Row numberOfSpaces={3} />
      {data.map((event, index) => {
        if (index % 2 === 1) return null
        const topEventCardData = data[index]
        const bottomEventCardData = data[index + 1]
        return (
          <React.Fragment key={JSON.stringify([topEventCardData, bottomEventCardData])}>
            <Spacer.Row numberOfSpaces={3} />
            <View>
              {/* @ts-expect-error: because of noUncheckedIndexedAccess */}
              <EventCard {...topEventCardData} {...analyticsParams} />
              {bottomEventCardData ? (
                <React.Fragment>
                  <Spacer.Column numberOfSpaces={3} />
                  <EventCard {...bottomEventCardData} {...analyticsParams} />
                </React.Fragment>
              ) : null}
            </View>
          </React.Fragment>
        )
      })}
      <Spacer.Row numberOfSpaces={6} />
    </Container>
  )
}

const Container = styled.ScrollView({
  paddingVertical: getSpacing(2),
})

const FlatListLineSpacer = () => <Spacer.Column numberOfSpaces={4} />

const StyledFlatList = styled(FlatList as typeof FlatList<EventCardProps>)(({ theme }) => ({
  marginHorizontal: theme.contentPage.marginHorizontal,
}))
