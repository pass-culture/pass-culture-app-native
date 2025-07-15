import type { Meta } from '@storybook/react-vite'
import React from 'react'

import { theme } from 'theme'
import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'

import { GenericColoredBanner } from './GenericColoredBanner'

const meta: Meta<typeof GenericColoredBanner> = {
  title: 'ui/banners/GenericColoredBanner',
  component: GenericColoredBanner,
}
export default meta

const message =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.'

const variantConfig: Variants<typeof GenericColoredBanner> = [
  {
    label: 'GenericColoredBanner default',
    props: { message },
  },
  {
    label: 'GenericColoredBanner with custom text color',
    props: { message, textColor: theme.designSystem.color.text.error },
  },
  {
    label: 'GenericColoredBanner with custom background color',
    props: { message, backgroundColor: theme.designSystem.color.background.warning },
  },
]

export const Template: VariantsStory<typeof GenericColoredBanner> = {
  name: 'GenericColoredBanner',
  render: (props) => (
    <VariantsTemplate
      variants={variantConfig}
      Component={GenericColoredBanner}
      defaultProps={props}
    />
  ),
}
