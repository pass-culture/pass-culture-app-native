import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import { selectArgTypeFromObject } from 'libs/storybook/selectArgTypeFromObject'
import { Bell } from 'ui/svg/icons/Bell'
import { BicolorEverywhere as Everywhere } from 'ui/svg/icons/BicolorEverywhere'
import { Spacer, Typo } from 'ui/theme'

import { GenericBanner } from './GenericBanner'

export default {
  title: 'ui/GenericBanner',
  component: GenericBanner,
  argTypes: {
    LeftIcon: selectArgTypeFromObject({
      Everywhere,
      Bell,
    }),
    children: { control: false },
  },
} as ComponentMeta<typeof GenericBanner>

const Template: ComponentStory<typeof GenericBanner> = (props) => <GenericBanner {...props} />

const textExample = () => (
  <React.Fragment>
    <Typo.ButtonText>Géolocalise-toi</Typo.ButtonText>
    <Spacer.Column numberOfSpaces={1} />
    <Typo.Body numberOfLines={2}>Pour trouver des offres autour de toi.</Typo.Body>
  </React.Fragment>
)

export const Default = Template.bind({})
Default.args = {
  children: textExample(),
  LeftIcon: Everywhere,
}
