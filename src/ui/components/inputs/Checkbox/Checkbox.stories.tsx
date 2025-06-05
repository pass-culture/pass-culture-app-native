import { NavigationContainer } from '@react-navigation/native'
import type { Meta } from '@storybook/react'
import React from 'react'

import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'
import { Calendar } from 'ui/svg/icons/Calendar'
import { Star } from 'ui/svg/Star'
import { Typo } from 'ui/theme'

import { Checkbox } from './Checkbox'

const meta: Meta<typeof Checkbox> = {
  title: 'ui/inputs/Checkbox',
  component: Checkbox,
  decorators: [
    (Story) => (
      <NavigationContainer>
        <Story />
      </NavigationContainer>
    ),
  ],
}
export default meta

const variantConfig: Variants<typeof Checkbox> = [
  {
    label: 'Checkbox Default',
    props: {
      label: 'Checkbox label',
      variant: 'default',
      isChecked: false,
    },
  },
  {
    label: 'Checkbox Default Required',
    props: {
      label: 'Checkbox label',
      variant: 'default',
      required: true,
      isChecked: false,
    },
  },
  {
    label: 'Checkbox Default Checked',
    props: {
      label: 'Checkbox label',
      variant: 'default',
      isChecked: true,
    },
  },
  {
    label: 'Checkbox Default Indeterminate',
    props: {
      label: 'Checkbox label',
      variant: 'default',
      isChecked: false,
      indeterminate: true,
    },
  },
  {
    label: 'Checkbox Default Has Error',
    props: {
      label: 'Checkbox label',
      variant: 'default',
      isChecked: false,
      hasError: true,
    },
  },
  {
    label: 'Checkbox Default Disabled',
    props: {
      label: 'Checkbox label',
      variant: 'default',
      isChecked: false,
      disabled: true,
    },
  },
  {
    label: 'Checkbox Detailed',
    props: {
      label: 'Checkbox label',
      variant: 'detailed',
      isChecked: false,
    },
  },
  {
    label: 'Checkbox Detailed With Description',
    props: {
      label: 'Checkbox label',
      variant: 'detailed',
      isChecked: false,
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
  },
  {
    label: 'Checkbox Detailed Hug',
    props: {
      label: 'Checkbox label',
      variant: 'detailed',
      isChecked: false,
      display: 'hug',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
  },
  {
    label: 'Checkbox Detailed Checked',
    props: {
      label: 'Checkbox label',
      variant: 'detailed',
      isChecked: true,
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
  },
  {
    label: 'Checkbox Detailed Indeterminate',
    props: {
      label: 'Checkbox label',
      variant: 'detailed',
      isChecked: false,
      indeterminate: true,
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
  },
  {
    label: 'Checkbox Detailed Disabled',
    props: {
      label: 'Checkbox label',
      variant: 'detailed',
      isChecked: false,
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      disabled: true,
    },
  },
  {
    label: 'Checkbox Detailed With Icon',
    props: {
      label: 'Checkbox label',
      variant: 'detailed',
      isChecked: false,
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      asset: { variant: 'icon', Icon: Calendar },
    },
  },
  {
    label: 'Checkbox Detailed Has Error',
    props: {
      label: 'Checkbox label',
      variant: 'detailed',
      isChecked: false,
      hasError: true,
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
  },
  {
    label: 'Checkbox Detailed With Text',
    props: {
      label: 'Checkbox label',
      variant: 'detailed',
      isChecked: false,
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      asset: { variant: 'text', text: '32\u00a0€' },
    },
  },
  {
    label: 'Checkbox Detailed With Image',
    props: {
      label: 'Checkbox label',
      variant: 'detailed',
      isChecked: false,
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      asset: {
        variant: 'image',
        src: 'https://storage.googleapis.com/passculture-metier-prod-production-assets-fine-grained/thumbs/mediations/9MPGW',
      },
    },
  },
  {
    label: 'Checkbox Detailed With Medium Image',
    props: {
      label: 'Checkbox label',
      variant: 'detailed',
      isChecked: false,
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      asset: {
        variant: 'image',
        src: 'https://storage.googleapis.com/passculture-metier-prod-production-assets-fine-grained/thumbs/mediations/9MPGW',
        size: 'medium',
      },
    },
  },
  {
    label: 'Checkbox Detailed With Large Image',
    props: {
      label: 'Checkbox label',
      variant: 'detailed',
      isChecked: false,
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      asset: {
        variant: 'image',
        src: 'https://storage.googleapis.com/passculture-metier-prod-production-assets-fine-grained/thumbs/mediations/9MPGW',
        size: 'large',
      },
    },
  },
  {
    label: 'Checkbox Detailed With Tag',
    props: {
      label: 'Checkbox label',
      variant: 'detailed',
      isChecked: false,
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      asset: { variant: 'tag', tag: { label: 'Tag label', Icon: <Star size={16} /> } },
    },
  },
  {
    label: 'Checkbox Detailed With Collapsed Content',
    props: {
      label: 'Checkbox label',
      variant: 'detailed',
      isChecked: true,
      asset: { variant: 'icon', Icon: Calendar },
      collapsed: <Typo.Body>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Typo.Body>,
    },
  },
]

export const Template: VariantsStory<typeof Checkbox> = {
  name: 'Checkbox',
  render: (props) => (
    <VariantsTemplate variants={variantConfig} Component={Checkbox} defaultProps={props} />
  ),
}
