import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { VariantsTemplate } from 'ui/storybook/VariantsTemplate'
import { Email } from 'ui/svg/icons/Email'
import { PlainArrowNext } from 'ui/svg/icons/PlainArrowNext'

import { ButtonWithLinearGradient } from './ButtonWithLinearGradient'

const meta: ComponentMeta<typeof ButtonWithLinearGradient> = {
  title: 'ui/buttons/ButtonWithLinearGradient',
  component: ButtonWithLinearGradient,
}
export default meta

const variantConfig = [
  {
    label: 'ButtonWithLinearGradient default',
    props: { onPress: () => 'doNothing', wording: 'Confirmer' },
  },
  {
    label: 'ButtonWithLinearGradient disabled',
    props: {
      onPress: () => 'doNothing',
      wording: 'Confirmer',
      isDisabled: true,
    },
  },
  {
    label: 'ButtonWithLinearGradient with fit content width',
    props: { onPress: () => 'doNothing', wording: 'Confirmer', fitContentWidth: true },
  },
  {
    label: 'ButtonWithLinearGradient with icon',
    props: { onPress: () => 'doNothing', wording: 'Consulter mes e-mails', icon: Email },
  },
  {
    label: 'ButtonWithLinearGradient with icon after wording',
    props: {
      onPress: () => 'doNothing',
      wording: 'C’est parti\u00a0!',
      icon: PlainArrowNext,
      iconAfterWording: true,
    },
  },
]

const Template: ComponentStory<typeof VariantsTemplate> = () => (
  <VariantsTemplate variants={variantConfig} Component={ButtonWithLinearGradient} />
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'ButtonWithLinearGradient'
