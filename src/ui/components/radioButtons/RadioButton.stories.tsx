import { NavigationContainer } from '@react-navigation/native'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import React, { useState } from 'react'

import { selectArgTypeFromObject } from 'libs/storybook/selectArgTypeFromObject'
import { VideoGame } from 'ui/svg/icons/bicolor/VideoGame'
import { EditPen } from 'ui/svg/icons/EditPen'
import { Email } from 'ui/svg/icons/Email'

import { RadioButton } from './RadioButton'

export default {
  title: 'ui/inputs/radioButtons/RadioButton',
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
} as ComponentMeta<typeof RadioButton>

const Template: ComponentStory<typeof RadioButton> = (args) => <RadioButton {...args} />

export const Default = Template.bind({})
Default.args = {
  label: 'label 1',
}

export const WithDescription = Template.bind({})
WithDescription.args = {
  label: 'label 1',
  description: 'description label 1',
}

export const WithSelectedValue = Template.bind({})
WithSelectedValue.args = {
  label: 'label 1',
  isSelected: true,
}

export const WithSelectedValueAndDescription = Template.bind({})
WithSelectedValueAndDescription.args = {
  label: 'label 1',
  description: 'description item 1',
}

export const WithIcon = Template.bind({})
WithIcon.args = {
  label: 'label 1',
  description: 'description item 1',
  icon: VideoGame,
}

export const WithLoading = Template.bind({})
WithLoading.args = {
  label: 'label 1',
  isLoading: true,
}

const items = [{ label: 'label 1' }, { label: 'label 2' }, { label: 'label 3' }]
const ListTemplate = () => {
  const [selectedValue, setSelectedRadioButton] = useState('')
  return (
    <React.Fragment>
      {items.map((item) => {
        const isSelected = selectedValue === item.label
        return (
          <RadioButton
            key={item.label}
            onSelect={() => setSelectedRadioButton(item.label)}
            isSelected={isSelected}
            {...item}
          />
        )
      })}
    </React.Fragment>
  )
}

export const WithMultipleRadioButton = ListTemplate.bind({})
