import { StoryObj, Meta } from '@storybook/react'
import React from 'react'

import { TutorialTimelineEighteen } from './TutorialTimelineEighteen'

const meta: Meta<typeof TutorialTimelineEighteen> = {
  title: 'features/tutorial/TutorialTimelineEighteen',
  component: TutorialTimelineEighteen,
}
export default meta

const Template: StoryObj<typeof TutorialTimelineEighteen> = (props) => (
  <TutorialTimelineEighteen {...props} />
)

//TODO(PC-28526): Fix this stories
const WithoutActivation = Template.bind({})
WithoutActivation.args = {
  activatedAt: undefined,
}

//TODO(PC-28526): Fix this stories
const ActivatedAt15 = Template.bind({})
ActivatedAt15.args = {
  activatedAt: 15,
}

//TODO(PC-28526): Fix this stories
const ActivatedAt16 = Template.bind({})
ActivatedAt16.args = {
  activatedAt: 16,
}

//TODO(PC-28526): Fix this stories
const ActivatedAt17 = Template.bind({})
ActivatedAt17.args = {
  activatedAt: 17,
}
