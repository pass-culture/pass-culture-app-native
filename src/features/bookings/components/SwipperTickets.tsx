import React, { useState } from 'react'
import {
  Animated,
  NativeScrollEvent,
  NativeSyntheticEvent,
  useWindowDimensions,
} from 'react-native'
import styled from 'styled-components/native'

import { SwipperTicketsControls } from 'features/bookings/components/SwipperTicketsControls'
import { ThreeShapesTicket } from 'features/bookings/components/ThreeShapesTicket'
import { getSpacing, Spacer, Typo } from 'ui/theme'

type TicketsProps = {
  title?: string
}

type Props = {
  tickets: TicketsProps[]
}

const SEPARATOR_VALUE = 4

export function SwipperTickets({ tickets }: Props) {
  const windowWidth = useWindowDimensions().width
  const ITEM_SIZE = windowWidth * 0.75
  const ITEM_SPACING = (windowWidth - ITEM_SIZE) / 2

  const [currentIndex, setCurrentIndex] = useState(1)

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const xPos = event.nativeEvent.contentOffset.x
    const xPosWithSpacing = xPos + ITEM_SPACING
    const index = Math.floor(xPosWithSpacing / ITEM_SIZE) + 1
    setCurrentIndex(index)
  }

  return (
    <Container>
      <Animated.FlatList
        data={tickets}
        keyExtractor={(index) => index.toString()}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        snapToInterval={ITEM_SIZE + getSpacing(SEPARATOR_VALUE)}
        decelerationRate="fast"
        style={{ flexGrow: 0 }}
        ItemSeparatorComponent={Separator}
        contentContainerStyle={{ paddingHorizontal: ITEM_SPACING }}
        onScroll={onScroll}
        renderItem={({ item, index }) => {
          return (
            <TicketsContainer key={index} width={ITEM_SIZE}>
              <ThreeShapesTicket>
                <Typo.ButtonText>{item.title}</Typo.ButtonText>
              </ThreeShapesTicket>
            </TicketsContainer>
          )
        }}
      />
      <Spacer.Column numberOfSpaces={5} />
      <SwipperTicketsControls
        numberOfSteps={tickets.length}
        currentStep={currentIndex}
        prevTitle="prev"
        nextTitle="next"
        onPressPrev={() => 'Press prev'}
        onPressNext={() => 'Press next'}
      />
    </Container>
  )
}

const Container = styled.View({
  alignItems: 'center',
})

const TicketsContainer = styled(Animated.View)<{ width: number }>(({ width }) => ({
  alignItems: 'center',
  justifyContent: 'center',
  width,
}))

const Separator = () => <Spacer.Row numberOfSpaces={SEPARATOR_VALUE} />
