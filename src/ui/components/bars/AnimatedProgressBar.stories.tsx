import type { Meta } from '@storybook/react'
import React from 'react'

import { theme } from 'theme'
import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'
import { EditPen } from 'ui/svg/icons/EditPen'
import { Email } from 'ui/svg/icons/Email'

import { AnimatedProgressBar } from './AnimatedProgressBar'

const meta: Meta<typeof AnimatedProgressBar> = {
  title: 'ui/AnimatedProgressBar',
  component: AnimatedProgressBar,
}
export default meta

const variantConfig: Variants<typeof AnimatedProgressBar> = [
  {
    label: 'AnimatedProgressBar default',
    props: { progress: 0.5, color: theme.designSystem.color.background.brandPrimary, icon: Email },
  },
  {
    label: 'AnimatedProgressBar empty',
    props: { progress: 0, color: theme.designSystem.color.background.success, icon: Email },
  },
  {
    label: 'AnimatedProgressBar full',
    props: { progress: 1, color: theme.designSystem.color.background.error, icon: EditPen },
  },
]

export const Template: VariantsStory<typeof AnimatedProgressBar> = {
  name: 'AnimatedProgressBar',
  render: (props) => (
    <VariantsTemplate
      variants={variantConfig}
      Component={AnimatedProgressBar}
      defaultProps={{ ...props }}
    />
  ),
}
