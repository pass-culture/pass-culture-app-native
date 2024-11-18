import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { VariantsTemplate } from 'ui/storybook/VariantsTemplate'
import { Email } from 'ui/svg/icons/Email'

import { ButtonQuaternarySecondary } from './ButtonQuaternarySecondary'

const meta: ComponentMeta<typeof ButtonQuaternarySecondary> = {
  title: 'ui/buttons/ButtonQuaternarySecondary',
  component: ButtonQuaternarySecondary,
}
export default meta

const variantConfig = [
  {
    label: 'ButtonQuaternarySecondary default',
    props: { wording: 'Confirmer' },
  },
  {
    label: 'ButtonQuaternarySecondary default disabled',
    props: { wording: 'Confirmer', disabled: true },
  },
  {
    label: 'ButtonQuaternarySecondary default loading',
    props: { wording: 'Confirmer', isLoading: true },
  },
  {
    label: 'ButtonQuaternarySecondary default with icon',
    props: { wording: 'Confirmer', icon: Email },
  },
  {
    label: 'ButtonQuaternarySecondary default disabled with icon',
    props: { wording: 'Confirmer', disabled: true, icon: Email },
  },
]

const Template: ComponentStory<typeof VariantsTemplate> = () => (
  <VariantsTemplate variants={variantConfig} Component={ButtonQuaternarySecondary} />
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'ButtonQuaternarySecondary'
