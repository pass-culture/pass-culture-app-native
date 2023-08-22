import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { ActionPlanTag } from './ActionPlanTag'

const meta: ComponentMeta<typeof ActionPlanTag> = {
  title: 'features/profile/buttons/ActionPlanTag',
  component: ActionPlanTag,
}
export default meta

const Template: ComponentStory<typeof ActionPlanTag> = (props) => <ActionPlanTag {...props} />

export const Default = Template.bind({})
Default.args = {}

export const NotDone = Template.bind({})
NotDone.args = {
  done: false,
}
