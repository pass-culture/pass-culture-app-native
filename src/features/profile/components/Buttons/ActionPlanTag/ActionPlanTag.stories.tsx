import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { VariantsTemplate } from 'ui/storybook/VariantsTemplate'

import { ActionPlanStatus, ActionPlanTag } from './ActionPlanTag'

const meta: ComponentMeta<typeof ActionPlanTag> = {
  title: 'features/profile/buttons/ActionPlanTag',
  component: ActionPlanTag,
}
export default meta

const variantConfig = [
  {
    label: 'ActionPlanTag',
  },
  {
    label: 'Ongoing ActionPlanTag',
    props: {
      status: ActionPlanStatus.ONGOING,
    },
  },
  {
    label: 'ToDo ActionPlanTag',
    props: {
      status: ActionPlanStatus.TODO,
    },
  },
]

const Template: ComponentStory<typeof VariantsTemplate> = () => (
  <VariantsTemplate variants={variantConfig} Component={ActionPlanTag} />
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'ActionPlanTag'
