import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { TutorialTimelineEighteen } from './TutorialTimelineEighteen'

const meta: Meta<typeof TutorialTimelineEighteen> = {
  title: 'features/tutorial/TutorialTimelineEighteen',
  component: TutorialTimelineEighteen,
}
export default meta

type Story = StoryObj<typeof TutorialTimelineEighteen>

//TODO(PC-28526): Fix this stories
export const WithoutActivation: Story = {
  render: (props) => <TutorialTimelineEighteen {...props} />,
  args: {
    activatedAt: undefined,
  },
}

//TODO(PC-28526): Fix this stories
export const ActivatedAt15: Story = {
  render: (props) => <TutorialTimelineEighteen {...props} />,
  args: {
    activatedAt: 15,
  },
}

//TODO(PC-28526): Fix this stories
export const ActivatedAt16: Story = {
  render: (props) => <TutorialTimelineEighteen {...props} />,
  args: {
    activatedAt: 16,
  },
}

//TODO(PC-28526): Fix this stories
export const ActivatedAt17: Story = {
  render: (props) => <TutorialTimelineEighteen {...props} />,
  args: {
    activatedAt: 17,
  },
}
