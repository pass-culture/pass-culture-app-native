import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import { theme } from 'theme'
import { SeparatorWithText } from 'ui/components/SeparatorWithText'
import { VariantsTemplate } from 'ui/storybook/VariantsTemplate'

const meta: ComponentMeta<typeof SeparatorWithText> = {
  title: 'ui/sections/SeparatorWithText',
  component: SeparatorWithText,
}
export default meta

const baseProps = {
  label: 'label',
}

const variantConfig = [
  {
    label: 'SeparatorWithText default',
    props: baseProps,
  },
  {
    label: 'SeparatorWithText with custom background color',
    props: { ...baseProps, backgroundColor: theme.colors.greyMedium },
  },
]

const Template: ComponentStory<typeof VariantsTemplate> = () => (
  <VariantsTemplate variants={variantConfig} Component={SeparatorWithText} />
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'SeparatorWithText'
