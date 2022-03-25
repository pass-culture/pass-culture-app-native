import { ComponentStory, ComponentMeta } from '@storybook/react'
import React, { useState } from 'react'

import { RadioButton } from './RadioButton'

export default {
  title: 'ui/inputs/RadioButton',
  component: RadioButton,
} as ComponentMeta<typeof RadioButton>

const Template: ComponentStory<typeof RadioButton> = (args) => <RadioButton {...args} />

export const Default = Template.bind({})
Default.args = {
  id: '1',
  title: 'item 1',
}

export const WithDescription = Template.bind({})
WithDescription.args = {
  id: '1',
  title: 'item 1',
  description: 'description item 1',
}

export const WithSelectedValue = Template.bind({})
WithSelectedValue.args = {
  id: '1',
  title: 'item 1',
  selectedValue: '1',
}

export const WithSelectedValueAndDescription = Template.bind({})
WithSelectedValueAndDescription.args = {
  id: '1',
  title: 'item 1',
  selectedValue: '1',
  description: 'description item 1',
}

const ListTemplate = () => {
  const [selectedValue, setSelectedRadioButton] = useState('')
  const items = [
    { id: '1', title: 'item 1', onSelect: setSelectedRadioButton, selectedValue },
    { id: '2', title: 'item 2', onSelect: setSelectedRadioButton, selectedValue },
    { id: '3', title: 'item 3', onSelect: setSelectedRadioButton, selectedValue },
  ]
  return (
    <React.Fragment>
      {items.map((item) => (
        <RadioButton key={item.id} {...item} />
      ))}
    </React.Fragment>
  )
}

export const WithMultipleRadioButton = ListTemplate.bind({})
