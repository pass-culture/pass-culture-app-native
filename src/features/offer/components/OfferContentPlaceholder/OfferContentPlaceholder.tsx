import React, { FunctionComponent } from 'react'
import { View } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { TextPlaceholder } from 'ui/components/placeholders/Placeholders'
import { SkeletonTile } from 'ui/components/placeholders/SkeletonTile'
import { SectionWithDivider } from 'ui/components/SectionWithDivider'
import { getSpacing, Spacer } from 'ui/theme'

export const OfferContentPlaceholder: FunctionComponent = () => {
  const { designSystem } = useTheme()
  return (
    <View testID="OfferContentPlaceholder">
      <Spacer.Column numberOfSpaces={designSystem.size.spacing.xxl} />
      <ImageContainer>
        <TextPlaceholder height={getSpacing(95)} width={getSpacing(60)} />
      </ImageContainer>
      <Spacer.Column numberOfSpaces={8} />
      <BodyContainer>
        <Row>
          <TextPlaceholder height={designSystem.size.spacing.xl} width={getSpacing(22)} />
          <Spacer.Row numberOfSpaces={2} />
          <TextPlaceholder height={designSystem.size.spacing.xl} width={getSpacing(22)} />
        </Row>
        <Spacer.Column numberOfSpaces={5} />
        <TextPlaceholder height={designSystem.size.spacing.l} width={getSpacing(74)} />
        <Spacer.Column numberOfSpaces={2} />
        <TextPlaceholder height={designSystem.size.spacing.l} width={getSpacing(40)} />
        <Spacer.Column numberOfSpaces={10} />
        <TextPlaceholder height={designSystem.size.spacing.xl} width={getSpacing(22)} />
        <Spacer.Column numberOfSpaces={10} />
        <TextPlaceholder height={designSystem.size.spacing.xl} width={getSpacing(63)} />
        <Spacer.Column numberOfSpaces={5} />
        <TextPlaceholder height={designSystem.size.spacing.l} width={getSpacing(33)} />
        <Spacer.Column numberOfSpaces={3.5} />
        <TextPlaceholder height={designSystem.size.spacing.s} width={getSpacing(82)} />
        <Spacer.Column numberOfSpaces={2} />
        <TextPlaceholder height={designSystem.size.spacing.s} width={getSpacing(67)} />
        <Spacer.Column numberOfSpaces={2} />
        <TextPlaceholder height={designSystem.size.spacing.s} width={getSpacing(82)} />
        <Spacer.Column numberOfSpaces={2} />
        <TextPlaceholder height={designSystem.size.spacing.s} width={getSpacing(67)} />
        <Spacer.Column numberOfSpaces={2} />
        <TextPlaceholder height={designSystem.size.spacing.s} width={getSpacing(82)} />
        <Spacer.Column numberOfSpaces={2} />
        <TextPlaceholder height={designSystem.size.spacing.s} width={getSpacing(82)} />
        <Spacer.Column numberOfSpaces={8} />
      </BodyContainer>
      <SectionWithDivider visible margin gap={0}>
        <Spacer.Column numberOfSpaces={8} />
        <TextPlaceholder height={designSystem.size.spacing.xl} width={getSpacing(63)} />
        <Spacer.Column numberOfSpaces={8} />
        <TextPlaceholder height={designSystem.size.spacing.l} width={getSpacing(33)} />
        <Spacer.Column numberOfSpaces={2} />
        <TextPlaceholder height={designSystem.size.spacing.s} width={getSpacing(58)} />
        <Spacer.Column numberOfSpaces={6} />
        <TextPlaceholder height={designSystem.size.spacing.xl} width={getSpacing(16)} />
        <Spacer.Column numberOfSpaces={4} />
      </SectionWithDivider>
      <BodyContainer>
        <SkeletonTile
          borderRadius={designSystem.size.borderRadius.xl}
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

const BodyContainer = styled.View(({ theme }) => ({
  marginHorizontal: theme.designSystem.size.spacing.xl,
}))

const Row = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
})
