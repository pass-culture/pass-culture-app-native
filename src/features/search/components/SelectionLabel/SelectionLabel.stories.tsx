import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { SelectionLabel } from './SelectionLabel'

const meta: ComponentMeta<typeof SelectionLabel> = {
  title: 'Features/search/SelectionLabel',
  component: SelectionLabel,
}
export default meta

const Template: ComponentStory<typeof SelectionLabel> = (props) => <SelectionLabel {...props} />

export const Label = Template.bind({})
Label.args = {
  label: 'Cinéma',
  selected: false,
}

export const SelectedLabel = Template.bind({})
SelectedLabel.args = {
  label: 'Cinéma',
  selected: true,
}

export const VeryLongLabel = Template.bind({})
VeryLongLabel.args = {
  label: 'Conférences, rencontres, spectacles, expositions et visites',
  selected: false,
}

export const SelectedVeryLongLabel = Template.bind({})
SelectedVeryLongLabel.args = {
  label: 'Conférences, rencontres, spectacles, expositions et visites',
  selected: true,
}
