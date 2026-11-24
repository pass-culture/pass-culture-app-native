import React, { FunctionComponent } from 'react'
import { useTheme } from 'styled-components/native'

import { ArrowFlatList } from 'ui/components/ArrowFlatList'

import { CinemaScreeningCard } from './CinemaScreeningCard'
import { CinemaScreeningCardProps } from './types'

type Props = {
  screenings: CinemaScreeningCardProps[]
}

export const CinemaScreeningCardList: FunctionComponent<Props> = ({ screenings }) => {
  const { designSystem } = useTheme()

  return (
    <ArrowFlatList
      data={screenings}
      horizontal
      contentContainerStyle={{
        gap: designSystem.size.spacing.m,
      }}
      showsHorizontalScrollIndicator={false}
      testID="cinema-screening-card-list"
      keyExtractor={(item, index) => `${item.time}-${index}`}
      renderItem={({ item }) => <CinemaScreeningCard {...item} fillHeight />}
    />
  )
}
