import type { Meta } from '@storybook/react'
import React from 'react'

import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'
import { BicolorClock } from 'ui/svg/icons/BicolorClock'

import { InformationWithIcon } from './InformationWithIcon'

const meta: Meta<typeof InformationWithIcon> = {
  title: 'ui/InformationWithIcon',
  component: InformationWithIcon,
}
export default meta

const baseProps = {
  Icon: BicolorClock,
  text: 'Information title',
}

const variantConfig: Variants<typeof InformationWithIcon> = [
  {
    label: 'InformationWithIcon default',
    props: baseProps,
  },
  {
    label: 'InformationWithIcon with subtitle',
    props: { ...baseProps, subtitle: 'Information subtitle' },
  },
]

const Template: VariantsStory<typeof InformationWithIcon> = (args) => (
  <VariantsTemplate variants={variantConfig} Component={InformationWithIcon} defaultProps={args} />
)

export const AllVariants = Template.bind({})
