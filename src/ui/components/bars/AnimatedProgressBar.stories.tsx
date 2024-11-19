import { ComponentMeta } from '@storybook/react'
import React from 'react'

import { theme } from 'theme'
import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'
import { EditPen } from 'ui/svg/icons/EditPen'
import { Email } from 'ui/svg/icons/Email'

import { AnimatedProgressBar } from './AnimatedProgressBar'

const meta: ComponentMeta<typeof AnimatedProgressBar> = {
  title: 'ui/AnimatedProgressBar',
  component: AnimatedProgressBar,
}
export default meta

const variantConfig: Variants<typeof AnimatedProgressBar> = [
  {
    label: 'AnimatedProgressBar default',
    props: { progress: 0.5, color: theme.colors.primary, icon: Email },
  },
  {
    label: 'AnimatedProgressBar empty',
    props: { progress: 0, color: theme.colors.greenLight, icon: Email },
  },
  {
    label: 'AnimatedProgressBar full',
    props: { progress: 1, color: theme.colors.error, icon: EditPen },
  },
]

const Template: VariantsStory<typeof AnimatedProgressBar> = () => (
  <VariantsTemplate variants={variantConfig} Component={AnimatedProgressBar} />
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'AnimatedProgressBar'
