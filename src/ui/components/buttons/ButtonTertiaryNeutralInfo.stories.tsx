import { ComponentMeta } from '@storybook/react'
import React from 'react'

import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'
import { Email } from 'ui/svg/icons/Email'

import { ButtonTertiaryNeutralInfo } from './ButtonTertiaryNeutralInfo'

const meta: ComponentMeta<typeof ButtonTertiaryNeutralInfo> = {
  title: 'ui/buttons/ButtonTertiaryNeutralInfo',
  component: ButtonTertiaryNeutralInfo,
}
export default meta

const variantConfig: Variants<typeof ButtonTertiaryNeutralInfo> = [
  // Default
  {
    label: 'ButtonTertiaryNeutralInfo default',
    props: { wording: 'Confirmer' },
  },
  {
    label: 'ButtonTertiaryNeutralInfo default disabled',
    props: { wording: 'Confirmer', disabled: true },
  },
  {
    label: 'ButtonTertiaryNeutralInfo default loading',
    props: { wording: 'Confirmer', isLoading: true },
  },
  {
    label: 'ButtonTertiaryNeutralInfo default with icon',
    props: { wording: 'Confirmer', icon: Email },
  },
  {
    label: 'ButtonTertiaryNeutralInfo default disabled with icon',
    props: { wording: 'Confirmer', disabled: true, icon: Email },
  },
]

const Template: VariantsStory<typeof ButtonTertiaryNeutralInfo> = () => (
  <VariantsTemplate variants={variantConfig} Component={ButtonTertiaryNeutralInfo} />
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'ButtonTertiaryNeutralInfo'
