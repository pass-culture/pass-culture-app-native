import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { VariantsTemplate } from 'ui/storybook/VariantsTemplate'
import { Email } from 'ui/svg/icons/Email'

import { ButtonTertiaryPrimary } from './ButtonTertiaryPrimary'

const meta: ComponentMeta<typeof ButtonTertiaryPrimary> = {
  title: 'ui/buttons/ButtonTertiaryPrimary',
  component: ButtonTertiaryPrimary,
}
export default meta

const variantConfig = [
  // Default
  {
    label: 'ButtonTertiaryPrimary default',
    props: { wording: 'Confirmer' },
  },
  {
    label: 'ButtonTertiaryPrimary default disabled',
    props: { wording: 'Confirmer', disabled: true },
  },
  {
    label: 'ButtonTertiaryPrimary default loading',
    props: { wording: 'Confirmer', isLoading: true },
  },
  {
    label: 'ButtonTertiaryPrimary default with icon',
    props: { wording: 'Confirmer', icon: Email },
  },
  {
    label: 'ButtonTertiaryPrimary default disabled with icon',
    props: { wording: 'Confirmer', disabled: true, icon: Email },
  },
]

const Template: ComponentStory<typeof VariantsTemplate> = () => (
  <VariantsTemplate variants={variantConfig} Component={ButtonTertiaryPrimary} />
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'ButtonTertiaryPrimary'