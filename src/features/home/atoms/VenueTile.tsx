import React from 'react'
import styled from 'styled-components/native'

import { VenueTypeCode } from 'api/gen'
import { VenueCaption } from 'features/home/atoms/VenueCaption'
import { ImageTile } from 'ui/components/ImageTile'
import { ColorsEnum, RATIO_HOME_IMAGE } from 'ui/theme'
import { BorderRadiusEnum, LENGTH_S } from 'ui/theme/grid'

interface VenueTileProps {
  name: string
  venueType: VenueTypeCode
  distance?: string
}

const imageHeight = LENGTH_S
const imageWidth = imageHeight * 2.25 * RATIO_HOME_IMAGE
// TODO (Lucasbeneston) : Remove when we get image from venue
const uri =
  'https://storage.googleapis.com/passculture-metier-ehp-testing-assets/thumbs/mediations/AMHA'

export const VenueTile = (props: VenueTileProps) => {
  const { name, venueType, distance } = props
  return (
    <Container>
      <TouchableHighlight imageHeight={imageHeight} imageWidth={imageWidth}>
        <ImageTile imageWidth={imageWidth} imageHeight={imageHeight} uri={uri} />
      </TouchableHighlight>
      <VenueCaption imageWidth={imageWidth} name={name} venueType={venueType} distance={distance} />
    </Container>
  )
}

const Container = styled.View({ flex: 1 })

const TouchableHighlight = styled.TouchableHighlight<{ imageHeight: number; imageWidth: number }>(
  ({ imageHeight, imageWidth }) => ({
    borderRadius: BorderRadiusEnum.BORDER_RADIUS,
    height: imageHeight,
    width: imageWidth,
    backgroundColor: ColorsEnum.GREY_DISABLED,
  })
)
