import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { TutorialTimelineEighteen } from './TutorialTimelineEighteen'

const meta: ComponentMeta<typeof TutorialTimelineEighteen> = {
  title: 'features/tutorial/TutorialTimelineEighteen',
  component: TutorialTimelineEighteen,
}
export default meta

const Template: ComponentStory<typeof TutorialTimelineEighteen> = (props) => (
  <TutorialTimelineEighteen {...props} />
)

export const WithoutActivation = Template.bind({})
WithoutActivation.args = {
  activatedAt: undefined,
}

export const ActivatedAt15 = Template.bind({})
ActivatedAt15.args = {
  activatedAt: 15,
}

export const ActivatedAt16 = Template.bind({})
ActivatedAt16.args = {
  activatedAt: 16,
}

export const ActivatedAt17 = Template.bind({})
ActivatedAt17.args = {
  activatedAt: 17,
}
