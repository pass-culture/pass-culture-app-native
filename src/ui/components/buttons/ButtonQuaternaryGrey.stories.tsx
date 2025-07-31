import type { Meta } from '@storybook/react-vite'
import React from 'react'

import { ButtonQuaternaryGrey } from 'ui/components/buttons/ButtonQuaternaryGrey'
import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'
import { Email } from 'ui/svg/icons/Email'

const meta: Meta<typeof ButtonQuaternaryGrey> = {
  title: 'ui/buttons/ButtonQuaternaryGrey',
  component: ButtonQuaternaryGrey,
}
export default meta

const variantConfig: Variants<typeof ButtonQuaternaryGrey> = [
  {
    label: 'ButtonQuaternaryGrey default',
    props: { wording: 'Confirmer' },
  },
  {
    label: 'ButtonQuaternaryGrey default disabled',
    props: { wording: 'Confirmer', disabled: true },
  },
  {
    label: 'ButtonQuaternaryGrey default loading',
    props: { wording: 'Confirmer', isLoading: true },
  },
  {
    label: 'ButtonQuaternaryGrey default with icon',
    props: { wording: 'Confirmer', icon: Email },
  },
  {
    label: 'ButtonQuaternaryGrey default disabled with icon',
    props: { wording: 'Confirmer', disabled: true, icon: Email },
  },
]

export const Template: VariantsStory<typeof ButtonQuaternaryGrey> = {
  name: 'ButtonQuaternaryGrey',
  render: (props) => (
    <VariantsTemplate
      variants={variantConfig}
      Component={ButtonQuaternaryGrey}
      defaultProps={props}
    />
  ),
}
