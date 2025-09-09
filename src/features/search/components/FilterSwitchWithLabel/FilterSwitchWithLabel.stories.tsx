import type { Meta } from '@storybook/react-vite'
import React from 'react'

import { FilterSwitchWithLabel } from 'features/search/components/FilterSwitchWithLabel/FilterSwitchWithLabel'
import { Variants, VariantsStory, VariantsTemplate } from 'ui/storybook/VariantsTemplate'

const meta: Meta<typeof FilterSwitchWithLabel> = {
  title: 'Features/search/FilterSwitchWithLabel',
  component: FilterSwitchWithLabel,
}
export default meta

const variantConfig: Variants<typeof FilterSwitchWithLabel> = [
  {
    label: 'FilterSwitchWithLabel Default',
    props: { isActive: true, label: 'Ceci est un label' },
  },
  {
    label: 'FilterSwitchWithLabel Without Subtitle',
    props: { isActive: true, label: 'Ceci est un label', subtitle: 'Ceci est un sous-titre' },
  },
]

export const Template: VariantsStory<typeof FilterSwitchWithLabel> = {
  name: 'FilterSwitchWithLabel',
  render: (props) => (
    <VariantsTemplate
      variants={variantConfig}
      Component={FilterSwitchWithLabel}
      defaultProps={props}
    />
  ),
}
