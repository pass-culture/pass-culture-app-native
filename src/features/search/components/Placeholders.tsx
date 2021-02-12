import React from 'react'
import ContentLoader from 'react-content-loader/native'
import { Dimensions } from 'react-native'
import { G, Rect } from 'react-native-svg'
import styled from 'styled-components/native'

import { getSpacing, Spacer, UniqueColors } from 'ui/theme'

const borderRadius = 4

const { width: windowWidth } = Dimensions.get('window')
const imageWidth = getSpacing(16)
const imageHeight = getSpacing(24) // ratio 2/3

const BasePlaceholder = ({ height, width }: { height: number; width: number }) => (
  <Rect rx={borderRadius} ry={borderRadius} height={height} width={width} />
)
const TextPlaceholder = ({ width, height }: { width: number; height?: number }) => (
  <Rect rx={2} ry={2} height={height ?? getSpacing(3)} width={width} />
)

export const NumberOfResultsPlaceholder = () => (
  <Container>
    <Spacer.Column numberOfSpaces={7} />
    <ContentLoader
      height={getSpacing(3)}
      width={getSpacing(20)}
      speed={1}
      backgroundColor={UniqueColors.BACKGROUND_COLOR}
      foregroundColor={UniqueColors.FOREGROUND_COLOR}>
      <Rect rx={2} ry={2} width={getSpacing(20)} height={getSpacing(3)} />
    </ContentLoader>
    <Spacer.Column numberOfSpaces={5} />
  </Container>
)

export const HitPlaceholder = () => {
  const x = imageWidth + getSpacing(4)
  return (
    <Container>
      <Row>
        <ContentLoader
          height={imageHeight}
          width={windowWidth}
          speed={1}
          backgroundColor={UniqueColors.BACKGROUND_COLOR}
          foregroundColor={UniqueColors.FOREGROUND_COLOR}>
          <BasePlaceholder height={imageHeight} width={imageWidth} />
          <G x={x} y={getSpacing(2)}>
            <TextPlaceholder width={getSpacing(60)} />
          </G>
          <G x={x} y={getSpacing(8)}>
            <TextPlaceholder width={getSpacing(30)} />
          </G>
          <G x={x} y={getSpacing(13)}>
            <TextPlaceholder width={getSpacing(40)} />
          </G>
          <G x={x} y={getSpacing(19)}>
            <TextPlaceholder width={getSpacing(8)} />
          </G>
        </ContentLoader>
      </Row>
    </Container>
  )
}

const Container = styled.View({ marginHorizontal: getSpacing(6) })
const Row = styled.View({ flexDirection: 'row', alignItems: 'center' })
