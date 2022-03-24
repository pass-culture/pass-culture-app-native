import { ComponentStory } from '@storybook/react'
import React from 'react'
import { Text } from 'react-native'

import { Illustration } from 'ui/storybook/Illustration'
import { IconInterface } from 'ui/svg/icons/types'
import { Facebook } from 'ui/svg/icons/socialNetwork/Facebook'
import { Instagram } from 'ui/svg/icons/socialNetwork/Instagram'
import { Snapchat } from 'ui/svg/icons/socialNetwork/Snapchat'
import { TikTok } from 'ui/svg/icons/socialNetwork/TikTok'
import { Twitter } from 'ui/svg/icons/socialNetwork/Twitter'
import { Telegram } from 'ui/svg/icons/socialNetwork/Telegram'
import { WhatsApp } from 'ui/svg/icons/socialNetwork/WhatsApp'

export default {
  title: 'ui/icons',
}

const Icons: ComponentStory<
  React.FC<{
    icon: Record<string, React.ComponentType<IconInterface>>
    children?: never
  }>
> = ({ icon }) => (
  <React.Fragment>
    <Text>{'Illustration icons should have a standard size of 140'}</Text>
    {Array.from(Object.entries(icon)).map(([name, icon]) => (
      <Illustration key={name} name={name} component={icon} />
    ))}
  </React.Fragment>
)

export const SocialNetwork = Icons.bind({})
SocialNetwork.args = {
  icon: {
    Facebook,
    Instagram,
    Snapchat,
    Twitter,
    WhatsApp,
    TikTok,
    Telegram,
  },
}

export const UniqueColors = Icons.bind({})
UniqueColors.args = {
  icon: {},
}
