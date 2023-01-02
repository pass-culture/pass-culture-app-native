import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { ActionPlanTag } from './ActionPlanTag'

export default {
  title: 'features/profile/buttons/ActionPlanTag',
  component: ActionPlanTag,
} as ComponentMeta<typeof ActionPlanTag>

const Template: ComponentStory<typeof ActionPlanTag> = (props) => <ActionPlanTag {...props} />

export const Default = Template.bind({})
Default.args = {}

export const NotDone = Template.bind({})
NotDone.args = {
  done: false,
}
