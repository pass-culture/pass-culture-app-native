import type { Meta } from '@storybook/react-vite'
import React from 'react'

import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'
import { Clock } from 'ui/svg/icons/Clock'

import { InformationWithIcon } from './InformationWithIcon'

const meta: Meta<typeof InformationWithIcon> = {
  title: 'ui/InformationWithIcon',
  component: InformationWithIcon,
}
export default meta

const baseProps = {
  Icon: Clock,
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
