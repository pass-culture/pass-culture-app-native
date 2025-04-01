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

export const Template: VariantsStory<typeof InformationWithIcon> = {
  name: 'InformationWithIcon',
  render: (props) => (
    <VariantsTemplate
      variants={variantConfig}
      Component={InformationWithIcon}
      defaultProps={props}
    />
  ),
}
