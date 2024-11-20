import { NavigationContainer } from '@react-navigation/native'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { selectArgTypeFromObject } from 'libs/storybook/selectArgTypeFromObject'
import { VariantsTemplate } from 'ui/storybook/VariantsTemplate'
import { VideoGame } from 'ui/svg/icons/bicolor/VideoGame'
import { EditPen } from 'ui/svg/icons/EditPen'
import { Email } from 'ui/svg/icons/Email'

import { RadioButton } from './RadioButton'

const meta: ComponentMeta<typeof RadioButton> = {
  title: 'ui/inputs/RadioButton',
  component: RadioButton,
  decorators: [
    (Story) => (
      <NavigationContainer>
        <Story />
      </NavigationContainer>
    ),
  ],
  argTypes: {
    icon: selectArgTypeFromObject({
      Email,
      EditPen,
      VideoGame,
    }),
  },
}
export default meta

const variantConfig = [
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

const Template: ComponentStory<typeof VariantsTemplate> = () => (
  <VariantsTemplate variants={variantConfig} Component={RadioButton} />
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'RadioButton'
