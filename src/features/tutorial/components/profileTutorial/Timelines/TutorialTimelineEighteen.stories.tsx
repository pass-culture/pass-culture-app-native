import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { TutorialTimelineEighteen } from './TutorialTimelineEighteen'

const meta: Meta<typeof TutorialTimelineEighteen> = {
  title: 'features/tutorial/TutorialTimelineEighteen',
  component: TutorialTimelineEighteen,
}
export default meta

type Story = StoryObj<typeof TutorialTimelineEighteen>

export const WithoutActivation: Story = {
  render: (props) => <TutorialTimelineEighteen {...props} />,
  args: {
    activatedAt: undefined,
  },
}

export const ActivatedAt15: Story = {
  render: (props) => <TutorialTimelineEighteen {...props} />,
  args: {
    activatedAt: 15,
  },
}

export const ActivatedAt16: Story = {
  render: (props) => <TutorialTimelineEighteen {...props} />,
  args: {
    activatedAt: 16,
  },
}

export const ActivatedAt17: Story = {
  render: (props) => <TutorialTimelineEighteen {...props} />,
  args: {
    activatedAt: 17,
  },
}
