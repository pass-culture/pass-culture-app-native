import type { Meta } from '@storybook/react-vite'
import React from 'react'

import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'
import { Email } from 'ui/svg/icons/Email'

import { ButtonSecondaryBlack } from './ButtonSecondaryBlack'

const meta: Meta<typeof ButtonSecondaryBlack> = {
  title: 'ui/buttons/ButtonSecondaryBlack',
  component: ButtonSecondaryBlack,
}
export default meta

const variantConfig: Variants<typeof ButtonSecondaryBlack> = [
  {
    label: 'ButtonSecondaryBlack default',
    props: { wording: 'Confirmer' },
  },
  {
    label: 'ButtonSecondaryBlack default disabled',
    props: { wording: 'Confirmer', disabled: true },
  },
  {
    label: 'ButtonSecondaryBlack default loading',
    props: { wording: 'Confirmer', isLoading: true },
  },
  {
    label: 'ButtonSecondaryBlack default with icon',
    props: { wording: 'Confirmer', icon: Email },
  },
  {
    label: 'ButtonSecondaryBlack default disabled with icon',
    props: { wording: 'Confirmer', disabled: true, icon: Email },
  },
]

export const Template: VariantsStory<typeof ButtonSecondaryBlack> = {
  name: 'ButtonSecondaryBlack',
  render: (props) => (
    <VariantsTemplate
      variants={variantConfig}
      Component={ButtonSecondaryBlack}
      defaultProps={props}
    />
  ),
}
