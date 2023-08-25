import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { DotComponent } from './DotComponent'

const meta: ComponentMeta<typeof DotComponent> = {
  title: 'ui/dotComponent',
  component: DotComponent,
}
export default meta

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
