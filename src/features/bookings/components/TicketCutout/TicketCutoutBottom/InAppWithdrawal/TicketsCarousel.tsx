import React, { useRef } from 'react'
import { useWindowDimensions } from 'react-native'
import { useSharedValue } from 'react-native-reanimated'
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel'
import styled from 'styled-components/native'

import { TicketText } from 'features/bookings/components/TicketCutout/TicketCutoutBottom/TicketText'
import { CarouselPagination } from 'ui/components/CarouselPagination/CarouselPagination'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { getSpacing } from 'ui/theme'

type Props = {
  tickets: React.JSX.Element[]
  qrCodeText: string
  displaySeat?: boolean
}
const TICKET_SIZE = getSpacing(50)
const TICKET_WITH_REF_HEIGHT = TICKET_SIZE + getSpacing(7)
const TICKET_WITH_REF_HEIGHT_AND_SEAT = TICKET_WITH_REF_HEIGHT + getSpacing(7)
const MARGINS_PADDINGS_TICKET_CUTOUT = (getSpacing(7.5) + getSpacing(6)) * 2

export const TicketsCarousel = ({ tickets, qrCodeText, displaySeat }: Props) => {
  const progressValue = useSharedValue<number>(0)
  const [index, setIndex] = React.useState(0)
  const { width: screenWidth } = useWindowDimensions()
  const TICKET_CONTAINER_WIDTH = screenWidth - MARGINS_PADDINGS_TICKET_CUTOUT
  const carouselRef = useRef<ICarouselInstance>(null)

  return (
    <Container gap={6}>
      <ViewGap gap={2}>
        <Carousel
          ref={carouselRef}
          vertical={false}
          height={displaySeat ? TICKET_WITH_REF_HEIGHT_AND_SEAT : TICKET_WITH_REF_HEIGHT}
          width={TICKET_CONTAINER_WIDTH}
          loop={false}
          scrollAnimationDuration={500}
          onProgressChange={(_, absoluteProgress) => {
            progressValue.value = absoluteProgress
            setIndex(absoluteProgress)
          }}
          defaultIndex={index}
          data={tickets}
          renderItem={({ item }) => (
            <TicketsContainer key={item.key} width={TICKET_CONTAINER_WIDTH}>
              {item}
            </TicketsContainer>
          )}
        />
        {tickets.length > 1 && progressValue ? (
          <CarouselPagination
            progressValue={progressValue}
            elementsCount={tickets.length}
            gap={2}
            carouselRef={carouselRef}
          />
        ) : null}
      </ViewGap>
      <TicketText>{qrCodeText}</TicketText>
    </Container>
  )
}

const Container = styled(ViewGap)(({ theme }) => ({
  backgroundColor: theme.colors.white,
  width: '100%',
  alignContent: 'center',
}))

const TicketsContainer = styled.View<{ width: number }>(({ width }) => ({
  alignItems: 'center',
  justifyContent: 'center',
  width,
}))
