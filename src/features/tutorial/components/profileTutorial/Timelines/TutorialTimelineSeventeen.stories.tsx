import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { TutorialTimelineSeventeen } from './TutorialTimelineSeventeen'

const meta: ComponentMeta<typeof TutorialTimelineSeventeen> = {
  title: 'features/tutorial/TutorialTimelineSeventeen',
  component: TutorialTimelineSeventeen,
}
export default meta

const Template: ComponentStory<typeof TutorialTimelineSeventeen> = (props) => (
  <TutorialTimelineSeventeen {...props} />
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
