import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { theme } from 'theme'
import { VariantsTemplate } from 'ui/storybook/VariantsTemplate'

import { GenericColoredBanner } from './GenericColoredBanner'

const meta: ComponentMeta<typeof GenericColoredBanner> = {
  title: 'ui/banners/GenericColoredBanner',
  component: GenericColoredBanner,
}
export default meta

const message =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.'

const variantConfig = [
  {
    label: 'GenericColoredBanner default',
    props: { message },
  },
  {
    label: 'GenericColoredBanner with custom text color',
    props: { message, textColor: theme.colors.error },
  },
  {
    label: 'GenericColoredBanner with custom background color',
    props: { message, backgroundColor: theme.colors.attention },
  },
]

const Template: ComponentStory<typeof VariantsTemplate> = () => (
  <VariantsTemplate variants={variantConfig} Component={GenericColoredBanner} />
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'GenericColoredBanner'
