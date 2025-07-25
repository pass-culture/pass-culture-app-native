import type { StoryObj } from '@storybook/react'
import React, { type ComponentProps } from 'react'
import styled from 'styled-components/native'

import { Separator } from 'ui/components/Separator'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Typo, getSpacing } from 'ui/theme'

type Variant<Props extends Record<string, unknown>> = {
  label: string
  props?: Partial<Props>
  withBackground?: boolean
  minHeight?: number
}

export type Variants<
  ComponentType extends React.ComponentType<Props>,
  Props extends Record<string, unknown> = ComponentProps<ComponentType>,
> = Variant<Props>[]

type VariantsTemplateProps<
  ComponentType extends React.ComponentType<Props>,
  Props extends Record<string, unknown>,
> = {
  variants: Variants<ComponentType, Props>
  // i don't know how to fix this
  // this component is generic, without this any, 1/3 of stories have typing issues
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Component: ComponentType | React.ComponentType<any>
  defaultProps?: Partial<Props>
}

export const VariantsTemplate = <
  ComponentType extends React.ComponentType<Props>,
  Props extends Record<string, unknown> = ComponentProps<ComponentType>,
>({
  variants,
  Component,
  defaultProps = {},
}: VariantsTemplateProps<ComponentType, Props>) => (
  <ViewGap gap={4}>
    {variants.map((variant, index) => {
      const props = {
        ...defaultProps,
        ...variant.props,
        // i don't know how to fix this
        // this component is generic, i don't know how to check in runtime
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any

      return (
        <React.Fragment key={variant.label}>
          <Typo.BodyAccentXs>{variant.label}</Typo.BodyAccentXs>

          <ComponentContainer withBackground={variant.withBackground} minHeight={variant.minHeight}>
            <Component {...props} />
            {variant.withBackground ? (
              <StyledBody>Le background ne fait pas partie du composant</StyledBody>
            ) : null}
          </ComponentContainer>

          {index < variants.length - 1 ? <Separator.Horizontal /> : null}
        </React.Fragment>
      )
    })}
  </ViewGap>
)

export type VariantsStory<
  ComponentType extends React.ComponentType<Props>,
  Props extends Record<string, unknown> = ComponentProps<ComponentType>,
> = StoryObj<ComponentType>

const ComponentContainer = styled.View<{ withBackground?: boolean; minHeight?: number }>(
  ({ withBackground, minHeight, theme }) => ({
    backgroundColor: withBackground
      ? theme.designSystem.color.background.brandSecondary
      : 'transparent',
    padding: getSpacing(2),
    borderRadius: getSpacing(2),
    minHeight,
  })
)

const StyledBody = styled(Typo.BodyAccentXs)(({ theme }) => ({
  marginTop: getSpacing(3),
  color: theme.designSystem.color.text.lockedInverted,
  fontStyle: 'italic',
}))
