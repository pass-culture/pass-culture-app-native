import { ComponentStory, ComponentMeta } from '@storybook/react'
import React, { useState } from 'react'

import { RadioButtonWithBorder } from './RadioButtonWithBorder'

export default {
  title: 'ui/inputs/radioButtons/RadioButtonWithBorder',
  component: RadioButtonWithBorder,
} as ComponentMeta<typeof RadioButtonWithBorder>

const Template: ComponentStory<typeof RadioButtonWithBorder> = (args) => (
  <RadioButtonWithBorder {...args} />
)

export const Default = Template.bind({})
Default.args = {
  label: 'Label 1',
}

export const WithDescription = Template.bind({})
WithDescription.args = {
  label: 'Label 1',
  description: 'description label 1',
}

export const WithSelectedValue = Template.bind({})
WithSelectedValue.args = {
  label: 'Label 1',
  selected: true,
}

export const WithSelectedValueAndDescription = Template.bind({})
WithSelectedValueAndDescription.args = {
  label: 'Label 1',
  description: 'description item 1',
}

const items = [
  { label: 'Label 1' },
  { label: 'Label 2', description: 'description item 1' },
  { label: 'Label 3' },
]
const ListTemplate = () => {
  const [selectedValue, setSelectedRadioButton] = useState('')
  return (
    <React.Fragment>
      {items.map((item) => {
        const isSelected = selectedValue === item.label
        return (
          <RadioButtonWithBorder
            key={item.label}
            onPress={() => setSelectedRadioButton(item.label)}
            selected={isSelected}
            {...item}
          />
        )
      })}
    </React.Fragment>
  )
}

export const WithMultipleRadioButton = ListTemplate.bind({})
