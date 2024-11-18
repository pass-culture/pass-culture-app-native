import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { VariantsTemplate } from 'ui/storybook/VariantsTemplate'
import { Email } from 'ui/svg/icons/Email'

import { ButtonSecondaryWhite } from './ButtonSecondaryWhite'

const meta: ComponentMeta<typeof ButtonSecondaryWhite> = {
  title: 'ui/buttons/ButtonSecondaryWhite',
  component: ButtonSecondaryWhite,
}
export default meta

const variantConfig = [
  {
    label: 'ButtonSecondaryWhite default',
    props: { wording: 'Confirmer' },
    withBackground: true,
  },
  {
    label: 'ButtonSecondaryWhite default disabled',
    props: { wording: 'Confirmer', disabled: true },
    withBackground: true,
  },
  {
    label: 'ButtonSecondaryWhite default loading',
    props: { wording: 'Confirmer', isLoading: true },
    withBackground: true,
  },
  {
    label: 'ButtonSecondaryWhite default with icon',
    props: { wording: 'Confirmer', icon: Email },
    withBackground: true,
  },
  {
    label: 'ButtonSecondaryWhite default disabled with icon',
    props: { wording: 'Confirmer', disabled: true, icon: Email },
    withBackground: true,
  },
]

const Template: ComponentStory<typeof VariantsTemplate> = () => (
  <VariantsTemplate variants={variantConfig} Component={ButtonSecondaryWhite} />
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'ButtonSecondaryWhite'
