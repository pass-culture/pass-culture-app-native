import React, { ComponentProps, FunctionComponent, PropsWithChildren } from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import styled from 'styled-components/native'

import { OfferImage } from 'ui/components/tiles/OfferImage'

export type HorizontalTileProps = PropsWithChildren<
  {
    style?: StyleProp<ViewStyle>
  } & Pick<ComponentProps<typeof OfferImage>, 'size' | 'categoryId' | 'imageUrl'>
>

export const HorizontalTile: FunctionComponent<HorizontalTileProps> = ({
  categoryId,
  imageUrl,
  children,
  size,
  style,
}) => {
  return (
    <Container style={style}>
      <OfferImage imageUrl={imageUrl} categoryId={categoryId} size={size} />
      {children}
    </Container>
  )
}

const Container = styled.View(({ theme }) => ({
  alignItems: 'center',
  flexDirection: 'row',
  gap: theme.designSystem.size.spacing.l,
}))
