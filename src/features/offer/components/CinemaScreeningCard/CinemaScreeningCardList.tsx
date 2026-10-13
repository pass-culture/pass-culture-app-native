import React, { FunctionComponent, useEffect, useState } from 'react'
import { LayoutChangeEvent } from 'react-native'
import styled from 'styled-components/native'

import { CinemaScreeningCard } from './CinemaScreeningCard'
import { CinemaScreeningCardProps } from './types'

type Props = {
  screenings: CinemaScreeningCardProps[]
}

export const CinemaScreeningCardList: FunctionComponent<Props> = ({ screenings }) => {
  const [largestCardHeight, setLargestCardHeight] = useState(0)
  const dataSignature = JSON.stringify(screenings)

  useEffect(() => setLargestCardHeight(0), [dataSignature])

  const updateLargestCardHeight = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout
    setLargestCardHeight((currentHeight) => Math.max(currentHeight, height))
  }

  return (
    <HorizontalScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      testID="cinema-screening-card-list">
      {screenings.map((screening, index) => (
        <CardContainer key={`${screening.time}-${index}`} isLast={index === screenings.length - 1}>
          <CinemaScreeningCard
            {...screening}
            minHeight={largestCardHeight || undefined}
            onLayout={updateLargestCardHeight}
          />
        </CardContainer>
      ))}
    </HorizontalScrollView>
  )
}

const HorizontalScrollView = styled.ScrollView({
  flexGrow: 0,
})

const CardContainer = styled.View<{ isLast: boolean }>(({ theme, isLast }) => ({
  marginRight: isLast ? 0 : theme.designSystem.size.spacing.m,
}))
