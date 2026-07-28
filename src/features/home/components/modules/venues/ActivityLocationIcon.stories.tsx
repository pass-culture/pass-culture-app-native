import type { Meta } from '@storybook/react-vite'
import React from 'react'

import { theme } from 'theme'
import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'
import { Bookstore } from 'ui/svg/icons/venueAndCategories/Bookstore'

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
      ActivityIcon: Bookstore,
      iconColor: theme.designSystem.color.icon.subtle,
      backgroundColor: theme.designSystem.color.background.subtle,
    },
  },
  {
    label: 'ActivityLocationIcon without color',
    props: {
      ActivityIcon: Bookstore,
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
