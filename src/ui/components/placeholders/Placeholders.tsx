import React, { FC } from 'react'
import { View } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { FavoriteButtonsContainer } from 'features/favorites/components/Favorite'
import { SkeletonTile } from 'ui/components/placeholders/SkeletonTile'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { getSpacing } from 'ui/theme'

const imageWidth = getSpacing(16)
const imageHeight = getSpacing(24) // ratio 2/3

const bookingImageWidth = getSpacing(18)
const bookingImageHeight = getSpacing(28)

const BasePlaceholder = (props: {
  height: number
  width: number
  radius?: number
  fullWidth?: boolean
}) => {
  const { designSystem } = useTheme()
  return (
    <SkeletonTile
      borderRadius={props.radius ?? designSystem.size.borderRadius.s}
      height={props.height}
      width={props.width}
      fullWidth={props.fullWidth}
    />
  )
}

export const TextPlaceholder = ({
  width,
  height,
  marginBottom,
}: {
  width: number
  height?: number
  marginBottom?: number
}) => {
  const { designSystem } = useTheme()
  return (
    <TextPlaceholderContainer marginBottom={marginBottom}>
      <SkeletonTile
        borderRadius={designSystem.size.borderRadius.s}
        height={height ?? designSystem.size.spacing.m}
        width={width}
      />
    </TextPlaceholderContainer>
  )
}

export const HeaderSearchResultsPlaceholder: FC = () => {
  const { designSystem } = useTheme()
  return (
    <React.Fragment>
      <TitleContainer>
        <TextPlaceholder height={designSystem.size.spacing.xl} width={getSpacing(50)} />
      </TitleContainer>
      <NumberOfResultsPlaceholder />
    </React.Fragment>
  )
}

export const NumberOfResultsPlaceholder = () => {
  const { designSystem } = useTheme()
  return (
    <Container>
      <SkeletonTile
        width={getSpacing(20)}
        height={designSystem.size.spacing.m}
        borderRadius={designSystem.size.borderRadius.s}
      />
    </Container>
  )
}

export const NumberOfBookingsPlaceholder = () => {
  const { designSystem } = useTheme()
  return (
    <Container>
      <SkeletonTile
        width={getSpacing(42)}
        height={designSystem.size.spacing.m}
        borderRadius={designSystem.size.borderRadius.s}
      />
    </Container>
  )
}

export const HitPlaceholder = () => (
  <Row gap={4}>
    <BasePlaceholder height={imageHeight} width={imageWidth} />
    <View>
      <TextPlaceholder width={getSpacing(60)} marginBottom={3} />
      <TextPlaceholder width={getSpacing(30)} marginBottom={1} />
      <TextPlaceholder width={getSpacing(40)} marginBottom={2} />
      <TextPlaceholder width={getSpacing(8)} />
    </View>
  </Row>
)

export const BookingHitPlaceholder = () => (
  <Row gap={4}>
    <BasePlaceholder height={bookingImageHeight} width={bookingImageWidth} />
    <View>
      <TextPlaceholder width={getSpacing(60)} marginBottom={1} />
      <TextPlaceholder width={getSpacing(30)} marginBottom={7} />
      <TextPlaceholder width={getSpacing(24)} marginBottom={3} />
      <TextPlaceholder width={getSpacing(8)} marginBottom={2} />
    </View>
  </Row>
)

export const FavoriteHitPlaceholder = () => {
  const { designSystem } = useTheme()
  return (
    <React.Fragment>
      <Row gap={4}>
        <BasePlaceholder height={imageHeight} width={imageWidth} />
        <View>
          <TextPlaceholder width={getSpacing(60)} marginBottom={3} />
          <TextPlaceholder width={getSpacing(30)} marginBottom={1} />
          <TextPlaceholder width={getSpacing(40)} marginBottom={2} />
          <TextPlaceholder width={getSpacing(8)} />
        </View>
      </Row>
      <FavoriteButtonsContainer gap={0}>
        <FirstButtonContainer>
          <BasePlaceholder
            radius={designSystem.size.borderRadius.xl}
            height={getSpacing(12)}
            width={getSpacing(40)}
            fullWidth
          />
        </FirstButtonContainer>
        <ButtonContainer>
          <BasePlaceholder
            radius={designSystem.size.borderRadius.xl}
            height={getSpacing(12)}
            width={getSpacing(40)}
            fullWidth
          />
        </ButtonContainer>
      </FavoriteButtonsContainer>
    </React.Fragment>
  )
}

const Container = styled.View(({ theme }) => ({
  marginHorizontal: getSpacing(6),
  marginTop: getSpacing(1),
  marginBottom: theme.designSystem.size.spacing.xl,
}))
const Row = styled(ViewGap)({
  flexDirection: 'row',
  alignItems: 'center',
  marginHorizontal: getSpacing(6),
})

const ButtonContainer = styled.View({
  minWidth: getSpacing(30),
  maxWidth: getSpacing(70),
  width: '47%',
})
const FirstButtonContainer = styled(ButtonContainer)(({ theme }) => ({
  marginRight: theme.designSystem.size.spacing.xl,
}))

const TextPlaceholderContainer = styled.View<{ marginBottom?: number }>(({ marginBottom }) => ({
  marginBottom: marginBottom ? getSpacing(marginBottom) : undefined,
}))

const TitleContainer = styled.View(({ theme }) => ({
  marginHorizontal: getSpacing(6),
  marginTop: getSpacing(6),
  marginBottom: theme.designSystem.size.spacing.s,
}))
