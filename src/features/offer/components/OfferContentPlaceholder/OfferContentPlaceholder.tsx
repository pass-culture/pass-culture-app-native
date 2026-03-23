import React, { FunctionComponent } from 'react'
import { View } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { TextPlaceholder } from 'ui/components/placeholders/Placeholders'
import { SkeletonTile } from 'ui/components/placeholders/SkeletonTile'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { getSpacing } from 'ui/theme'

export const OfferContentPlaceholder: FunctionComponent = () => {
  const { designSystem } = useTheme()
  return (
    <View testID="OfferContentPlaceholder">
      <ImageContainer>
        <TextPlaceholder height={getSpacing(95)} width={getSpacing(60)} />
      </ImageContainer>
      <BodyContainer>
        <Row>
          <TextPlaceholder height={designSystem.size.spacing.xl} width={getSpacing(22)} />
          <TextPlaceholder height={designSystem.size.spacing.xl} width={getSpacing(22)} />
        </Row>
        <StyledTextPlaceholder
          marginBottom={designSystem.size.spacing.xxs}
          height={designSystem.size.spacing.l}
          width={getSpacing(74)}
        />
        <StyledTextPlaceholder
          marginBottom={designSystem.size.spacing.s}
          height={designSystem.size.spacing.l}
          width={getSpacing(40)}
        />
        <StyledTextPlaceholder
          marginBottom={designSystem.size.spacing.s}
          height={designSystem.size.spacing.xl}
          width={getSpacing(22)}
        />
        <StyledTextPlaceholder
          marginBottom={designSystem.size.spacing.xs}
          height={designSystem.size.spacing.xl}
          width={getSpacing(63)}
        />
        <StyledTextPlaceholder
          marginBottom={designSystem.size.spacing.xs}
          height={designSystem.size.spacing.l}
          width={getSpacing(33)}
        />
        <StyledViewGap gap={2}>
          <TextPlaceholder height={designSystem.size.spacing.s} width={getSpacing(82)} />
          <TextPlaceholder height={designSystem.size.spacing.s} width={getSpacing(67)} />
          <TextPlaceholder height={designSystem.size.spacing.s} width={getSpacing(82)} />
          <TextPlaceholder height={designSystem.size.spacing.s} width={getSpacing(67)} />
          <TextPlaceholder height={designSystem.size.spacing.s} width={getSpacing(82)} />
          <TextPlaceholder height={designSystem.size.spacing.s} width={getSpacing(82)} />
        </StyledViewGap>
      </BodyContainer>
      <Divider />
      <Wrapper>
        <StyledTextPlaceholderWithMarginTop
          marginBottom={designSystem.size.spacing.s}
          height={designSystem.size.spacing.xl}
          width={getSpacing(63)}
        />
        <StyledTextPlaceholder
          marginBottom={designSystem.size.spacing.xxs}
          height={designSystem.size.spacing.l}
          width={getSpacing(33)}
        />
        <StyledTextPlaceholder
          marginBottom={designSystem.size.spacing.s}
          height={designSystem.size.spacing.s}
          width={getSpacing(58)}
        />
        <StyledTextPlaceholder
          marginBottom={designSystem.size.spacing.xs}
          height={designSystem.size.spacing.xl}
          width={getSpacing(16)}
        />
      </Wrapper>

      <BodyContainer>
        <SkeletonTile
          borderRadius={designSystem.size.borderRadius.xl}
          width={getSpacing(82)}
          height={designSystem.size.spacing.xxxl}
          fullWidth
        />
      </BodyContainer>
    </View>
  )
}
const StyledViewGap = styled(ViewGap)(({ theme }) => ({
  flexDirection: 'column',
  marginBottom: theme.designSystem.size.spacing.xxl,
}))

const Wrapper = styled.View(({ theme }) => ({
  marginHorizontal: theme.designSystem.size.spacing.xl,
}))
const StyledTextPlaceholder = styled(TextPlaceholder)<{ marginBottom: number }>(
  ({ marginBottom }) => ({
    marginBottom,
  })
)
const StyledTextPlaceholderWithMarginTop = styled(StyledTextPlaceholder)<{ marginBottom: number }>(
  ({ marginBottom, theme }) => ({
    marginBottom,
    marginTop: theme.designSystem.size.spacing.xxl,
    paddingTop: theme.designSystem.size.spacing.xxl,
  })
)

const ImageContainer = styled.View(({ theme }) => ({
  alignItems: 'center',
  marginTop: theme.designSystem.size.spacing.xxxxl,
  marginBottom: theme.designSystem.size.spacing.xxl,
}))

const BodyContainer = styled.View(({ theme }) => ({
  marginHorizontal: theme.designSystem.size.spacing.xl,
  marginBottom: theme.designSystem.size.spacing.xxl,
}))

const Row = styled.View(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.designSystem.size.spacing.s,
  marginBottom: theme.designSystem.size.spacing.xl,
}))

const Divider = styled.View(({ theme }) => ({
  height: theme.designSystem.size.spacing.s,
  backgroundColor: theme.designSystem.color.background.subtle,
  marginBottom: theme.designSystem.size.spacing.xxl,
}))
