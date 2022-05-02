import { t } from '@lingui/macro'
import React, { useState, useRef } from 'react'
import {
  FlatList,
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
const INTERVAL = getSpacing(SEPARATOR_VALUE)

export function SwipperTickets({ tickets }: Props) {
  const flatListRef = useRef<FlatList>(null)

  const windowWidth = useWindowDimensions().width
  const ITEM_SIZE = windowWidth * 0.75
  const ITEM_SPACING = (windowWidth - ITEM_SIZE) / 2

  const [currentIndex, setCurrentIndex] = useState(1)

  const currentIndexTotalItemSize = ITEM_SIZE * currentIndex
  const currentIndexTotalInterval = INTERVAL * currentIndex
  const moveToNextTicket = () => {
    const nextItemPosition = currentIndexTotalItemSize + currentIndexTotalInterval
    if (flatListRef.current)
      return flatListRef.current.scrollToOffset({
        offset: nextItemPosition,
        animated: true,
      })
  }
  const moveToPrevTicket = () => {
    const prevItemPosition =
      currentIndexTotalItemSize +
      currentIndexTotalInterval -
      ITEM_SPACING +
      INTERVAL -
      ITEM_SIZE * 2
    if (flatListRef.current)
      return flatListRef.current.scrollToOffset({
        offset: prevItemPosition,
        animated: true,
      })
  }

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const xPos = event.nativeEvent.contentOffset.x
    const xPosWithSpacing = xPos + ITEM_SPACING
    const index = Math.floor(xPosWithSpacing / ITEM_SIZE) + 1
    setCurrentIndex(index)
  }

  return (
    <Container>
      <FlatList
        ref={flatListRef}
        data={tickets}
        keyExtractor={(index) => index.title.toString()}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        snapToInterval={ITEM_SIZE + INTERVAL}
        decelerationRate="fast"
        style={{ flexGrow: 0 }}
        ItemSeparatorComponent={Separator}
        contentContainerStyle={{ paddingHorizontal: ITEM_SPACING }}
        onScroll={onScroll}
        renderItem={({ item }) => {
          return (
            <TicketsContainer key={item.title} width={ITEM_SIZE}>
              <ThreeShapesTicket>
                {/* TODO(LucasBeneston): Replace with BookingDetailsTicketContent */}
                <StyledButtonText>{item.title}</StyledButtonText>
              </ThreeShapesTicket>
            </TicketsContainer>
          )
        }}
      />
      <Spacer.Column numberOfSpaces={5} />
      <SwipperTicketsControls
        numberOfSteps={tickets.length}
        currentStep={currentIndex}
        prevTitle={t`Revenir au ticket précédent`}
        nextTitle={t`Voir le ticket suivant`}
        onPressPrev={moveToPrevTicket}
        onPressNext={moveToNextTicket}
      />
    </Container>
  )
}

const Container = styled.View({
  alignItems: 'center',
})

const TicketsContainer = styled.View<{ width: number }>(({ width }) => ({
  alignItems: 'center',
  justifyContent: 'center',
  width,
}))

const Separator = () => <Spacer.Row numberOfSpaces={SEPARATOR_VALUE} />

const StyledButtonText = styled(Typo.ButtonText)(({ theme }) => ({
  minHeight: theme.ticket.minHeight,
}))
