import type { Meta } from '@storybook/react-vite'
import React from 'react'

import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'
import { EditPen } from 'ui/svg/icons/EditPen'
import { Email } from 'ui/svg/icons/Email'
import { VideoGame } from 'ui/svg/icons/venueAndCategories/VideoGame'

import { RadioButton } from './RadioButton'

const meta: Meta<typeof RadioButton> = {
  title: 'ui/inputs/RadioButton',
  component: RadioButton,

  argTypes: {
    icon: {
      options: ['Email', 'EditPen', 'VideoGame'],
      mapping: {
        Email,
        EditPen,
        VideoGame,
      },
      control: {
        type: 'select',
        labels: {},
      },
    },
  },
}
export default meta

const variantConfig: Variants<typeof RadioButton> = [
  {
    label: 'RadioButton',
    props: { label: 'label 1', isSelected: false },
  },
  {
    label: 'RadioButton with description',
    props: {
      label: 'label 1',
      description: 'description label 1',
      isSelected: false,
    },
  },
  {
    label: 'Selected RadioButton',
    props: { label: 'label 1', isSelected: true },
  },
  {
    label: 'Selected RadioButton with description',
    props: { label: 'label 1', description: 'description item 1', isSelected: true },
  },
  {
    label: 'RadioButton with icon',
    props: {
      label: 'label 1',
      description: 'description item 1',
      icon: VideoGame,
      isSelected: false,
    },
  },
]

export const Template: VariantsStory<typeof RadioButton> = {
  name: 'RadioButton',
  render: (props) => (
    <VariantsTemplate
      variants={variantConfig}
      Component={RadioButton}
      defaultProps={{ ...props }}
    />
  ),
}
