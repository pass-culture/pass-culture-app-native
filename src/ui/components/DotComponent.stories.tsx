import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { DotComponent } from './DotComponent'

export default {
  title: 'ui/dotComponent',
  component: DotComponent,
} as ComponentMeta<typeof DotComponent>

const Template: ComponentStory<typeof DotComponent> = (props) => <DotComponent {...props} />
export const Done = Template.bind({})
Done.args = {
  index: 1,
  activeIndex: 2,
  numberOfSteps: 3,
  isActive: false,
}
export const DoneNeutral = Template.bind({})
DoneNeutral.args = {
  index: 1,
  activeIndex: 2,
  numberOfSteps: 3,
  isActive: false,
  withNeutralPreviousStepsColor: true,
}
export const Active = Template.bind({})
Active.args = {
  index: 1,
  activeIndex: 1,
  numberOfSteps: 3,
  isActive: true,
}
export const ToDo = Template.bind({})
ToDo.args = {
  index: 2,
  activeIndex: 1,
  numberOfSteps: 3,
  isActive: false,
}
