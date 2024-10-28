import React from 'react'

import { Separator } from 'ui/components/Separator'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { TypoDS } from 'ui/theme'

type Variant<Props extends Record<string, unknown>> = {
  label: string
  props: Props
}

type VariantsTemplateProps<Props extends Record<string, unknown>> = {
  variants: Variant<Props>[]
  Component: React.ComponentType<Props>
}

export const VariantsTemplate = <Props extends Record<string, unknown>>({
  variants,
  Component,
}: VariantsTemplateProps<Props>) => (
  <ViewGap gap={4}>
    {variants.map((variant, index) => (
      <React.Fragment key={variant.label}>
        <TypoDS.BodyAccentXs>{variant.label}</TypoDS.BodyAccentXs>
        <Component {...variant.props} />
        {index < variants.length - 1 ? <Separator.Horizontal /> : null}
      </React.Fragment>
    ))}
  </ViewGap>
)
