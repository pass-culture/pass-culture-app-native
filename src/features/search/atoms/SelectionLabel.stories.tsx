import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { SelectionLabel } from './SelectionLabel'

export default {
  title: 'ui/SelectionLabel',
  component: SelectionLabel,
} as ComponentMeta<typeof SelectionLabel>

const Template: ComponentStory<typeof SelectionLabel> = (props) => <SelectionLabel {...props} />

export const Label = Template.bind({})
Label.args = {
  label: 'Cinéma',
  selected: false,
}

export const VeryLongLabel = Template.bind({})
VeryLongLabel.args = {
  label: 'Conférences, rencontres, spectacles, expositions et visites',
  selected: false,
}

export const SelectedLabel = Template.bind({})
SelectedLabel.args = {
  label: 'Cinéma',
  selected: true,
}

export const Labels = () => (
  <React.Fragment>
    <SelectionLabel label="Cinéma" selected={false} onPress={() => null} />
    <SelectionLabel label="Musique" selected={true} onPress={() => null} />
  </React.Fragment>
)
