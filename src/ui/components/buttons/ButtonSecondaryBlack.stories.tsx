import { ComponentMeta } from '@storybook/react'
import React from 'react'

import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'
import { Email } from 'ui/svg/icons/Email'

import { ButtonSecondaryBlack } from './ButtonSecondaryBlack'

const meta: ComponentMeta<typeof ButtonSecondaryBlack> = {
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

const Template: VariantsStory<typeof ButtonSecondaryBlack> = (args) => (
  <VariantsTemplate variants={variantConfig} Component={ButtonSecondaryBlack} defaultProps={args} />
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'ButtonSecondaryBlack'
