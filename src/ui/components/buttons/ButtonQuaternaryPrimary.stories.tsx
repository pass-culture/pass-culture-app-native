import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { VariantsTemplate } from 'ui/storybook/VariantsTemplate'
import { Email } from 'ui/svg/icons/Email'

import { ButtonQuaternaryPrimary } from './ButtonQuaternaryPrimary'

const meta: ComponentMeta<typeof ButtonQuaternaryPrimary> = {
  title: 'ui/buttons/ButtonQuaternaryPrimary',
  component: ButtonQuaternaryPrimary,
}
export default meta

const variantConfig = [
  {
    label: 'ButtonQuaternaryPrimary default',
    props: { wording: 'Confirmer' },
  },
  {
    label: 'ButtonQuaternaryPrimary default disabled',
    props: { wording: 'Confirmer', disabled: true },
  },
  {
    label: 'ButtonQuaternaryPrimary default loading',
    props: { wording: 'Confirmer', isLoading: true },
  },
  {
    label: 'ButtonQuaternaryPrimary default with icon',
    props: { wording: 'Confirmer', icon: Email },
  },
  {
    label: 'ButtonQuaternaryPrimary default disabled with icon',
    props: { wording: 'Confirmer', disabled: true, icon: Email },
  },
]

const Template: ComponentStory<typeof VariantsTemplate> = () => (
  <VariantsTemplate variants={variantConfig} Component={ButtonQuaternaryPrimary} />
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'ButtonQuaternaryPrimary'