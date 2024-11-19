import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import { VariantsTemplate } from 'ui/storybook/VariantsTemplate'
import { BicolorClock } from 'ui/svg/icons/BicolorClock'

import { InformationWithIcon } from './InformationWithIcon'

const meta: ComponentMeta<typeof InformationWithIcon> = {
  title: 'ui/InformationWithIcon',
  component: InformationWithIcon,
}
export default meta

const baseProps = {
  Icon: BicolorClock,
  text: 'Information title',
}

const variantConfig = [
  {
    label: 'InformationWithIcon default',
    props: baseProps,
  },
  {
    label: 'InformationWithIcon with subtitle',
    props: { ...baseProps, subtitle: 'Information subtitle' },
  },
]

const Template: ComponentStory<typeof VariantsTemplate> = () => (
  <VariantsTemplate variants={variantConfig} Component={InformationWithIcon} />
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'InformationWithIcon'
