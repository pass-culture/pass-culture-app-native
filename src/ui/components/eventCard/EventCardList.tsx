import React, { useState } from 'react'
import { View, FlatList, StyleSheet } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { EventCard, EventCardProps, EVENT_CARD_WIDTH } from 'ui/components/eventCard/EventCard'
import { Spacer, getSpacing } from 'ui/theme'

type Props = {
  data: EventCardProps[]
}

export const EventCardList: React.FC<Props> = ({ data }) => {
  const [webViewWidth, setWebViewWidth] = useState(0)
  const { isDesktopViewport } = useTheme()

  const numColumns = Math.max(Math.floor(webViewWidth / (EVENT_CARD_WIDTH + getSpacing(4))), 1)

  if (isDesktopViewport) {
    return (
      <View
        onLayout={(event) => {
          const { width } = event.nativeEvent.layout
          setWebViewWidth(width)
        }}>
        <FlatList<EventCardProps>
          listAs="ul"
          itemAs="li"
          key={numColumns}
          data={data}
          renderItem={({ item }: { item: EventCardProps }) => (
            <React.Fragment>
              <EventCard {...item} />
              <Spacer.Row numberOfSpaces={4} />
            </React.Fragment>
          )}
          keyExtractor={(item) => JSON.stringify(item)}
          ItemSeparatorComponent={FlatListLineSpacer}
          numColumns={numColumns}
          contentContainerStyle={styles.contentContainerStyle}
        />
      </View>
    )
  }

  return (
    <Container horizontal showsHorizontalScrollIndicator={false}>
      <Spacer.Row numberOfSpaces={2} />
      {data.map((event, index) => {
        if (index % 2 === 1) return null
        const topEventCardData = data[index]
        const bottomEventCardData = data[index + 1]
        return (
          <React.Fragment key={JSON.stringify([topEventCardData, bottomEventCardData])}>
            <Spacer.Row numberOfSpaces={4} />
            <View>
              {/* @ts-expect-error: because of noUncheckedIndexedAccess */}
              <EventCard {...topEventCardData} />
              {bottomEventCardData ? (
                <React.Fragment>
                  <Spacer.Column numberOfSpaces={4} />
                  <EventCard {...bottomEventCardData} />
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
const styles = StyleSheet.create({
  contentContainerStyle: {
    alignItems: 'flex-start',
  },
})

const FlatListLineSpacer = () => <Spacer.Column numberOfSpaces={4} />
