import React, { FunctionComponent } from 'react'
import { View } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { offerImageContainerMarginTop } from 'features/offer/helpers/useOfferImageContainerDimensions'
import { TextPlaceholder } from 'ui/components/placeholders/Placeholders'
import { SkeletonTile } from 'ui/components/placeholders/SkeletonTile'
import { SectionWithDivider } from 'ui/components/SectionWithDivider'
import { getSpacing, Spacer } from 'ui/theme'

export const OfferContentPlaceholder: FunctionComponent = () => {
  const { borderRadius } = useTheme()
  return (
    <View testID="OfferContentPlaceholder">
      <Spacer.Column numberOfSpaces={offerImageContainerMarginTop} />
      <ImageContainer>
        <TextPlaceholder height={getSpacing(95)} width={getSpacing(60)} />
      </ImageContainer>
      <Spacer.Column numberOfSpaces={8} />
      <BodyContainer>
        <Row>
          <TextPlaceholder height={getSpacing(6)} width={getSpacing(22)} />
          <Spacer.Row numberOfSpaces={2} />
          <TextPlaceholder height={getSpacing(6)} width={getSpacing(22)} />
        </Row>
        <Spacer.Column numberOfSpaces={5} />
        <TextPlaceholder height={getSpacing(4)} width={getSpacing(74)} />
        <Spacer.Column numberOfSpaces={2} />
        <TextPlaceholder height={getSpacing(4)} width={getSpacing(40)} />
        <Spacer.Column numberOfSpaces={10} />
        <TextPlaceholder height={getSpacing(5)} width={getSpacing(22)} />
        <Spacer.Column numberOfSpaces={10} />
        <TextPlaceholder height={getSpacing(5)} width={getSpacing(63)} />
        <Spacer.Column numberOfSpaces={5} />
        <TextPlaceholder height={getSpacing(4)} width={getSpacing(33)} />
        <Spacer.Column numberOfSpaces={3.5} />
        <TextPlaceholder height={getSpacing(2)} width={getSpacing(82)} />
        <Spacer.Column numberOfSpaces={2} />
        <TextPlaceholder height={getSpacing(2)} width={getSpacing(67)} />
        <Spacer.Column numberOfSpaces={2} />
        <TextPlaceholder height={getSpacing(2)} width={getSpacing(82)} />
        <Spacer.Column numberOfSpaces={2} />
        <TextPlaceholder height={getSpacing(2)} width={getSpacing(67)} />
        <Spacer.Column numberOfSpaces={2} />
        <TextPlaceholder height={getSpacing(2)} width={getSpacing(82)} />
        <Spacer.Column numberOfSpaces={2} />
        <TextPlaceholder height={getSpacing(2)} width={getSpacing(82)} />
        <Spacer.Column numberOfSpaces={8} />
      </BodyContainer>
      <SectionWithDivider visible margin gap={0}>
        <Spacer.Column numberOfSpaces={8} />
        <TextPlaceholder height={getSpacing(5)} width={getSpacing(63)} />
        <Spacer.Column numberOfSpaces={8} />
        <TextPlaceholder height={getSpacing(4)} width={getSpacing(33)} />
        <Spacer.Column numberOfSpaces={2} />
        <TextPlaceholder height={getSpacing(2)} width={getSpacing(58)} />
        <Spacer.Column numberOfSpaces={6} />
        <TextPlaceholder height={getSpacing(6)} width={getSpacing(16)} />
        <Spacer.Column numberOfSpaces={4} />
      </SectionWithDivider>
      <BodyContainer>
        <SkeletonTile
          borderRadius={borderRadius.button}
          width={getSpacing(82)}
          height={getSpacing(10)}
          fullWidth
        />
      </BodyContainer>
      <Spacer.Column numberOfSpaces={8} />
    </View>
  )
}

const ImageContainer = styled.View({
  alignItems: 'center',
})

const BodyContainer = styled.View({
  marginHorizontal: getSpacing(6),
})

const Row = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
})
