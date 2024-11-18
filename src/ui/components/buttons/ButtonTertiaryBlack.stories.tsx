import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { VariantsTemplate } from 'ui/storybook/VariantsTemplate'
import { Email } from 'ui/svg/icons/Email'

import { ButtonTertiaryBlack } from './ButtonTertiaryBlack'

const meta: ComponentMeta<typeof ButtonTertiaryBlack> = {
  title: 'ui/buttons/ButtonTertiaryBlack',
  component: ButtonTertiaryBlack,
}
export default meta

const variantConfig = [
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

const Template: ComponentStory<typeof VariantsTemplate> = () => (
  <VariantsTemplate variants={variantConfig} Component={ButtonTertiaryBlack} />
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'ButtonTertiaryBlack'
