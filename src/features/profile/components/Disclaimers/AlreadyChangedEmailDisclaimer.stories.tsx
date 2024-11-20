import { ComponentMeta } from '@storybook/react'
import React from 'react'

import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'

import { AlreadyChangedEmailDisclaimer } from './AlreadyChangedEmailDisclaimer'

const meta: ComponentMeta<typeof AlreadyChangedEmailDisclaimer> = {
  title: 'features/profile/disclaimers/AlreadyChangedEmailDisclaimer',
  component: AlreadyChangedEmailDisclaimer,
}
export default meta

const variantConfig: Variants<typeof AlreadyChangedEmailDisclaimer> = [
  {
    label: 'AlreadyChangedEmailDisclaimer',
  },
]

const Template: VariantsStory<typeof AlreadyChangedEmailDisclaimer> = () => (
  <VariantsTemplate variants={variantConfig} Component={AlreadyChangedEmailDisclaimer} />
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'AlreadyChangedEmailDisclaimer'
