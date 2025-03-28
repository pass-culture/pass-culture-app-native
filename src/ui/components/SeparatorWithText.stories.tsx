import type { Meta } from '@storybook/react'
import React from 'react'

import { theme } from 'theme'
import { SeparatorWithText } from 'ui/components/SeparatorWithText'
import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'

const meta: Meta<typeof SeparatorWithText> = {
  title: 'ui/sections/SeparatorWithText',
  component: SeparatorWithText,
}
export default meta

const baseProps = {
  label: 'label',
}

const variantConfig: Variants<typeof SeparatorWithText> = [
  {
    label: 'SeparatorWithText default',
    props: baseProps,
  },
  {
    label: 'SeparatorWithText with custom background color',
    props: { ...baseProps, backgroundColor: theme.colors.greyMedium },
  },
]

const Template: VariantsStory<typeof SeparatorWithText> = (args) => (
  <VariantsTemplate
    variants={variantConfig}
    Component={SeparatorWithText}
    defaultProps={{ ...args }}
  />
)

export const AllVariants = Template.bind({})
