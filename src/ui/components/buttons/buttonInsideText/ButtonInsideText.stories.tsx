import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { ButtonInsideTexteProps } from 'ui/components/buttons/buttonInsideText/types'
import { VariantsTemplate } from 'ui/storybook/VariantsTemplate'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { Typo } from 'ui/theme'

import { ButtonInsideText } from './ButtonInsideText'

const meta: ComponentMeta<typeof ButtonInsideText> = {
  title: 'ui/buttons/ButtonInsideText',
  component: ButtonInsideText,
}
export default meta

const variantConfig = [
  {
    label: 'ButtonInsideText inactive',
    props: { wording: 'wording' },
  },
  {
    label: 'ButtonInsideText inactive disabled',
    props: { wording: 'wording', icon: ExternalSiteFilled },
  },
  {
    label: 'ButtonInsideText active',
    props: {
      wording: 'wording',
      typography: 'Caption',
    },
  },
  {
    label: 'ButtonInsideText active disabled',
    props: {
      wording: 'wording',
      typography: 'Caption',
      icon: ExternalSiteFilled,
    },
  },
]

const RandomText = (props: ButtonInsideTexteProps) => {
  const startText = 'Lorem ipsum dolor '
  const endText = ' sit amet consectetur adipisicing elit.'
  const TypoComponent = props.typography ? Typo[props.typography] : Typo.Body

  return (
    <TypoComponent>
      {startText}
      <ButtonInsideText {...props} />
      {endText}
    </TypoComponent>
  )
}

const Template: ComponentStory<typeof VariantsTemplate> = () => (
  <VariantsTemplate variants={variantConfig} Component={RandomText} />
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'ButtonInsideText'
