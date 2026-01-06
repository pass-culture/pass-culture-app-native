import type { Meta } from '@storybook/react-vite'
import React from 'react'

import { theme } from 'theme'
import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'
import { Bag } from 'ui/svg/icons/venueAndCategories/Bag'

import { ActivityLocationIcon } from './ActivityLocationIcon'

const meta: Meta<typeof ActivityLocationIcon> = {
  title: 'Features/home/ActivityLocationIcon',
  component: ActivityLocationIcon,
}
export default meta

const variantConfig: Variants<typeof ActivityLocationIcon> = [
  {
    label: 'ActivityLocationIcon with color',
    props: {
      ActivityIcon: Bag,
      iconColor: theme.designSystem.color.icon.subtle,
      backgroundColor: theme.designSystem.color.background.subtle,
    },
  },
  {
    label: 'ActivityLocationIcon without color',
    props: {
      ActivityIcon: Bag,
    },
  },
]

export const Template: VariantsStory<typeof ActivityLocationIcon> = {
  name: 'ActivityLocationIcon',
  render: (props) => (
    <VariantsTemplate
      variants={variantConfig}
      Component={ActivityLocationIcon}
      defaultProps={props}
    />
  ),
}
