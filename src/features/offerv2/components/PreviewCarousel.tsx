import * as React from 'react'
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated'
import Carousel from 'react-native-reanimated-carousel'
import styled from 'styled-components/native'

import { Typo } from 'ui/theme'

const CARD_WIDTH = 240
const CAROUSEL_WIDTH = CARD_WIDTH + 20 * 2

type Props = {
  cards: string[]
  parallaxScrollingScale?: number
  parallaxScrollingOffset?: number
  parallaxAdjacentItemScale?: number
  scrollAnimationDuration?: number
}

export const PreviewCarousel: React.FunctionComponent<Props> = ({
  cards,
  parallaxScrollingScale,
  parallaxScrollingOffset,
  parallaxAdjacentItemScale,
  scrollAnimationDuration,
}) => {
  const progressValue = useSharedValue<number>(0)
  const baseOptions = {
    vertical: false,
    width: CAROUSEL_WIDTH,
    height: 400,
  } as const

  return (
    <Container>
      <Carousel
        {...baseOptions}
        style={{
          width: CAROUSEL_WIDTH,
        }}
        loop={false}
        scrollAnimationDuration={scrollAnimationDuration}
        onProgressChange={(_, absoluteProgress) => (progressValue.value = absoluteProgress)}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale,
          parallaxScrollingOffset,
          parallaxAdjacentItemScale,
        }}
        data={cards}
        renderItem={({ index, item: color }) => (
          <CardContainer color={color}>
            <Typo.Title2>{index}</Typo.Title2>
          </CardContainer>
        )}
      />
      {!!progressValue && (
        <PaginationContainer>
          {cards.map((_, index) => {
            return (
              <PaginationItem
                animValue={progressValue}
                index={index}
                key={index}
                length={cards.length}
              />
            )
          })}
        </PaginationContainer>
      )}
    </Container>
  )
}

const PaginationItem: React.FunctionComponent<{
  index: number
  length: number
  animValue: Animated.SharedValue<number>
}> = (props) => {
  const { animValue, index, length } = props
  const width = 10

  const animStyle = useAnimatedStyle(() => {
    let inputRange = [index - 1, index, index + 1]
    let outputRange = [-width, 0, width]

    if (index === 0 && animValue?.value > length - 1) {
      inputRange = [length - 1, length, length + 1]
      outputRange = [-width, 0, width]
    }

    return {
      transform: [
        {
          translateX: interpolate(animValue?.value, inputRange, outputRange, Extrapolate.CLAMP),
        },
      ],
    }
  }, [animValue, index, length])

  return (
    <DotsContainer width={width}>
      <Dot width={width} style={animStyle} />
    </DotsContainer>
  )
}

const Container = styled.View({
  alignItems: 'center',
})

const CardContainer = styled.View<{ color: string }>(({ color }) => ({
  width: 240,
  height: 380,
  borderWidth: 2,
  borderColor: 'black',
  borderRadius: 8,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: color,
}))

const PaginationContainer = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
  width: 100,
  alignSelf: 'center',
})

const DotsContainer = styled.View<{ width: number }>(({ width }) => ({
  backgroundColor: 'white',
  width,
  height: width,
  borderRadius: 50,
  overflow: 'hidden',
}))

const Dot = styled(Animated.View)<{ width: number }>(({ width }) => ({
  flex: 1,
  borderRadius: width / 2,
  backgroundColor: 'black',
}))
