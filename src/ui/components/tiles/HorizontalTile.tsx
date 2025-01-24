import React, { FC, PropsWithChildren } from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import styled from 'styled-components/native'

import { CategoryIdEnum } from 'api/gen'
import { OfferImage } from 'ui/components/tiles/OfferImage'
import { getSpacing } from 'ui/theme'

export type HorizontalTileProps = PropsWithChildren<{
  categoryId: CategoryIdEnum
  imageUrl?: string
  style?: StyleProp<ViewStyle>
}>

export const HorizontalTile: FC<HorizontalTileProps> = ({
  categoryId,
  imageUrl,
  children,
  style,
}) => {
  return (
    <Container style={style}>
      <OfferImage imageUrl={imageUrl} categoryId={categoryId} />
      {children}
    </Container>
  )
}

const Container = styled.View({
  alignItems: 'center',
  flexDirection: 'row',
  gap: getSpacing(4),
})
