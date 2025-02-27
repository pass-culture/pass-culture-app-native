import { Meta } from '@storybook/react'
import React from 'react'

import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'
import { Email } from 'ui/svg/icons/Email'

import { ButtonTertiaryBlack } from './ButtonTertiaryBlack'

const meta: Meta<typeof ButtonTertiaryBlack> = {
  title: 'ui/buttons/ButtonTertiaryBlack',
  component: ButtonTertiaryBlack,
}
export default meta

const variantConfig: Variants<typeof ButtonTertiaryBlack> = [
  {
    label: 'ButtonTertiaryBlack default',
    props: { wording: 'Confirmer' },
  },
  {
    label: 'ButtonTertiaryBlack default disabled',
    props: { wording: 'Confirmer', disabled: true },
  },
  {
    label: 'ButtonTertiaryBlack default loading',
    props: { wording: 'Confirmer', isLoading: true },
  },
  {
    label: 'ButtonTertiaryBlack default with icon',
    props: { wording: 'Confirmer', icon: Email },
  },
  {
    label: 'ButtonTertiaryBlack default disabled with icon',
    props: { wording: 'Confirmer', disabled: true, icon: Email },
  },
]

const Template: VariantsStory<typeof ButtonTertiaryBlack> = (args) => (
  <VariantsTemplate variants={variantConfig} Component={ButtonTertiaryBlack} defaultProps={args} />
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'ButtonTertiaryBlack'
