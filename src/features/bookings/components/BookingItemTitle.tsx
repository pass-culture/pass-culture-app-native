import React from 'react'
import { Dimensions } from 'react-native'
import styled from 'styled-components/native'

import { getSpacing, Typo } from 'ui/theme'

type BookingItemTitleProps = {
  ticketWidth: number
  title: string
}

export function BookingItemTitle(props: BookingItemTitleProps) {
  const containerWidth = getTitleWidth(props.ticketWidth)

  return (
    <TitleContainer width={containerWidth}>
      <Title numberOfLines={2}>{props.title}</Title>
    </TitleContainer>
  )
}

const TitleContainer = styled.View<{ width: number }>(({ width }) => ({
  flexDirection: 'row',
  width: width,
  paddingBottom: getSpacing(1),
}))

export const Title = styled(Typo.ButtonText)({
  flexShrink: 1,
})

export function getTitleWidth(excludedRowWidth: number) {
  return Dimensions.get('screen').width - excludedRowWidth - getSpacing(12)
}
