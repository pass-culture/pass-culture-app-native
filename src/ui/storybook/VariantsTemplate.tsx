/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import styled from 'styled-components/native'

import { Separator } from 'ui/components/Separator'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { TypoDS, getSpacing } from 'ui/theme'

type Variant<Props extends Record<string, unknown>> = {
  label: string
  props: Partial<Props>
  withBackground?: boolean
  minHeight?: number
}

type VariantsTemplateProps<Props extends Record<string, unknown>> = {
  variants: Variant<Props>[] | any[]
  Component: React.ComponentType<Props> | any
}

export const VariantsTemplate = <Props extends Record<string, unknown>>({
  variants,
  Component,
}: VariantsTemplateProps<Props>) => (
  <ViewGap gap={4}>
    {variants.map((variant, index) => (
      <React.Fragment key={variant.label}>
        <TypoDS.BodyAccentXs>{variant.label}</TypoDS.BodyAccentXs>

        <ComponentContainer withBackground={variant.withBackground} minHeight={variant.minHeight}>
          <Component {...variant.props} />
          {variant.withBackground ? (
            <StyledBody>Le background ne fait pas partie du composant</StyledBody>
          ) : null}
        </ComponentContainer>

        {index < variants.length - 1 ? <Separator.Horizontal /> : null}
      </React.Fragment>
    ))}
  </ViewGap>
)

const ComponentContainer = styled.View<{ withBackground?: boolean; minHeight: number }>(
  ({ withBackground, minHeight, theme }) => ({
    backgroundColor: withBackground ? theme.colors.secondaryLight200 : theme.colors.transparent,
    padding: getSpacing(2),
    borderRadius: getSpacing(2),
    minHeight,
  })
)

const StyledBody = styled(TypoDS.BodyAccentXs)(({ theme }) => ({
  marginTop: getSpacing(3),
  color: theme.colors.white,
  fontStyle: 'italic',
}))
