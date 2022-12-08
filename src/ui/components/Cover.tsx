import React from 'react'
import styled from 'styled-components/native'

import { Image } from 'libs/resizing-image-on-demand/Image'
import { ArrowNextDouble as DefaultArrowNextDouble } from 'ui/svg/icons/ArrowNextDouble'
import { getSpacing } from 'ui/theme'
interface Props {
  height: number
  width: number
  uri: string
}

export const Cover = (props: Props) => {
  return (
    <Container height={props.height} width={props.width}>
      <StyledImage url={props.uri} testID="coverImage" />
      <ArrowsContainer>
        <ArrowMarginContainer>
          <ArrowNextDouble />
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

const StyledImage = styled(Image)(({ theme }) => ({
  height: '100%',
  width: '100%',
  borderRadius: theme.borderRadius.radius,
}))

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

const ArrowNextDouble = styled(DefaultArrowNextDouble).attrs(({ theme }) => ({
  color: theme.colors.white,
  size: 56, // Special case where theme.icons.sizes is not used
}))``
