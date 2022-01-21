import React from 'react'
import styled from 'styled-components/native'

import { ArrowNextDouble } from 'ui/svg/icons/ArrowNextDouble'
import { ColorsEnum, getSpacing } from 'ui/theme'
import { BorderRadiusEnum } from 'ui/theme/grid'

interface Props {
  height: number
  width: number
  uri: string
}

export const Cover = (props: Props) => {
  return (
    <Container height={props.height} width={props.width}>
      <Image source={{ uri: props.uri }} testID="coverImage" />
      <ArrowsContainer>
        <ArrowMarginContainer>
          <ArrowNextDouble color={ColorsEnum.WHITE} size={56} />
        </ArrowMarginContainer>
      </ArrowsContainer>
    </Container>
  )
}

const Container = styled.View<{ width: number; height: number }>(({ width, height }) => ({
  height,
  width,
  alignItems: 'flex-end',
  justifyContent: 'center',
}))

const Image = styled.Image({
  height: '100%',
  width: '100%',
  borderRadius: BorderRadiusEnum.BORDER_RADIUS,
})

const ArrowsContainer = styled.View(({ theme }) => ({
  position: 'absolute',
  zIndex: theme.zIndex.homeOfferCoverIcons,
  flexDirection: 'row',
  alignItems: 'center',
}))

const ArrowMarginContainer = styled.View({
  marginRight: getSpacing(-6),
  marginTop: getSpacing(7),
})
