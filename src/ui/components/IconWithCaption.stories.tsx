import type { Meta } from '@storybook/react'
import React from 'react'

import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'
import { categoriesIcons } from 'ui/svg/icons/exports/categoriesIcons'
import { getSpacing } from 'ui/theme'

import { IconWithCaption } from './IconWithCaption'

const meta: Meta<typeof IconWithCaption> = {
  title: 'ui/IconWithCaption',
  component: IconWithCaption,
  argTypes: {
    Icon: {
      options: Object.keys(categoriesIcons),
      mapping: categoriesIcons,
      control: {
        type: 'select',
        labels: {},
      },
    },
  },
}
export default meta

const baseProps = {
  Icon: categoriesIcons.LiveEvent,
  caption: 'Festival',
  accessibilityLabel: 'Festival de musique',
}

const variantConfig: Variants<typeof IconWithCaption> = [
  {
    label: 'IconWithCaption default',
    props: baseProps,
    minHeight: getSpacing(20),
  },
  {
    label: 'IconWithCaption disabled',
    props: { ...baseProps, isDisabled: true },
    minHeight: getSpacing(20),
  },
]

export const Template: VariantsStory<typeof IconWithCaption> = {
  name: 'IconWithCaption',
  render: (props) => (
    <VariantsTemplate
      variants={variantConfig}
      Component={IconWithCaption}
      defaultProps={{ ...props }}
    />
  ),
}
