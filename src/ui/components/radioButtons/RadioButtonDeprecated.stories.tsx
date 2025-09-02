import { NavigationContainer } from '@react-navigation/native'
import type { Meta } from '@storybook/react-vite'
import React from 'react'

import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'
import { EditPen } from 'ui/svg/icons/EditPen'
import { Email } from 'ui/svg/icons/Email'
import { VideoGame } from 'ui/svg/icons/venueAndCategories/VideoGame'

import { RadioButtonDeprecated } from './RadioButtonDeprecated'

const meta: Meta<typeof RadioButtonDeprecated> = {
  title: 'ui/inputs/RadioButton',
  component: RadioButtonDeprecated,
  decorators: [
    (Story) => (
      <NavigationContainer>
        <Story />
      </NavigationContainer>
    ),
  ],
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

const variantConfig: Variants<typeof RadioButtonDeprecated> = [
  {
    label: 'RadioButtonDeprecated',
    props: { label: 'label 1', isSelected: false },
  },
  {
    label: 'RadioButtonDeprecated with description',
    props: {
      label: 'label 1',
      description: 'description label 1',
      isSelected: false,
    },
  },
  {
    label: 'Selected RadioButtonDeprecated',
    props: { label: 'label 1', isSelected: true },
  },
  {
    label: 'Selected RadioButtonDeprecated with description',
    props: { label: 'label 1', description: 'description item 1', isSelected: true },
  },
  {
    label: 'RadioButtonDeprecated with icon',
    props: {
      label: 'label 1',
      description: 'description item 1',
      icon: VideoGame,
      isSelected: false,
    },
  },
]

export const Template: VariantsStory<typeof RadioButtonDeprecated> = {
  name: 'RadioButtonDeprecated',
  render: (props) => (
    <VariantsTemplate
      variants={variantConfig}
      Component={RadioButtonDeprecated}
      defaultProps={{ ...props }}
    />
  ),
}
