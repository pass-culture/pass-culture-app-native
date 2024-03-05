import React from 'react'
import { ScrollView, View } from 'react-native'

import { EventCard, EventCardProps } from 'ui/components/eventCard/EventCard'
import { Spacer } from 'ui/theme'

type Props = {
  data: EventCardProps[]
}

export const EventCardList: React.FC<Props> = ({ data }) => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
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
    </ScrollView>
  )
}
