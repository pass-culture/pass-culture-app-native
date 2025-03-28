import type { Meta } from '@storybook/react'
import React from 'react'

import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'

import { ActionPlanStatus, ActionPlanTag } from './ActionPlanTag'

const meta: Meta<typeof ActionPlanTag> = {
  title: 'features/profile/buttons/ActionPlanTag',
  component: ActionPlanTag,
}
export default meta

const variantConfig: Variants<typeof ActionPlanTag> = [
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

const Template: VariantsStory<typeof ActionPlanTag> = (args) => (
  <VariantsTemplate variants={variantConfig} Component={ActionPlanTag} defaultProps={args} />
)

export const AllVariants = Template.bind({})
