import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { ButtonQuaternaryGrey } from 'ui/components/buttons/ButtonQuaternaryGrey'
import { VariantsTemplate } from 'ui/storybook/VariantsTemplate'
import { Email } from 'ui/svg/icons/Email'

const meta: ComponentMeta<typeof ButtonQuaternaryGrey> = {
  title: 'ui/buttons/ButtonQuaternaryGrey',
  component: ButtonQuaternaryGrey,
}
export default meta

const variantConfig = [
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

const Template: ComponentStory<typeof VariantsTemplate> = () => (
  <VariantsTemplate variants={variantConfig} Component={ButtonQuaternaryGrey} />
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'ButtonQuaternaryGrey'