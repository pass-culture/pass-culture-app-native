import React, { FunctionComponent } from 'react'
import { StyleSheet } from 'react-native'
import styled from 'styled-components/native'

import { CinemaScreeningCard } from './CinemaScreeningCard'
import { CinemaScreeningCardProps } from './types'

type Props = {
  screenings: CinemaScreeningCardProps[]
}

export const CinemaScreeningCardList: FunctionComponent<Props> = ({ screenings }) => {
  return (
    <HorizontalScrollView
      horizontal
      contentContainerStyle={styles.contentContainer}
      showsHorizontalScrollIndicator={false}
      testID="cinema-screening-card-list">
      {screenings.map((screening, index) => (
        <CardContainer key={`${screening.time}-${index}`} isLast={index === screenings.length - 1}>
          <CinemaScreeningCard {...screening} fillHeight />
        </CardContainer>
      ))}
    </HorizontalScrollView>
  )
}

const HorizontalScrollView = styled.ScrollView({
  flexGrow: 0,
})

const CardContainer = styled.View<{ isLast: boolean }>(({ theme, isLast }) => ({
  alignSelf: 'stretch',
  marginRight: isLast ? 0 : theme.designSystem.size.spacing.m,
}))

const styles = StyleSheet.create({
  contentContainer: { alignItems: 'stretch' },
})
