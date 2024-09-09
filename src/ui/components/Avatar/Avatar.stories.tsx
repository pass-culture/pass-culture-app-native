import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'
import LinearGradient from 'react-native-linear-gradient'
import styled from 'styled-components/native'

import { theme } from 'theme'
import { BicolorProfile } from 'ui/svg/icons/BicolorProfile'
import { Profile } from 'ui/svg/icons/Profile'
import { Typo } from 'ui/theme'
import { AVATAR_LARGE, AVATAR_MEDIUM, AVATAR_SMALL } from 'ui/theme/constants'

import { Avatar } from './Avatar'

const meta: ComponentMeta<typeof Avatar> = {
  title: 'ui/Avatar',
  component: Avatar,
}

const DefaultAvatar = styled(LinearGradient).attrs(({ theme }) => ({
  colors: [theme.colors.secondary, theme.colors.primary],
  useAngle: true,
  angle: -30,
}))({ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' })

export default meta

const Template: ComponentStory<typeof Avatar> = (args) => <Avatar {...args} />

export const Small = Template.bind({})
Small.args = {
  size: AVATAR_SMALL,
  children: <Typo.Title3>M</Typo.Title3>,
}

export const Medium = Template.bind({})
Medium.args = {
  size: AVATAR_MEDIUM,
  backgroundColor: theme.colors.attentionLight,
  children: <Typo.Title3>M</Typo.Title3>,
}

export const Large = Template.bind({})
Large.args = {
  size: AVATAR_LARGE,
  children: <Profile size={40} />,
}

export const WithBorders = Template.bind({})
WithBorders.args = {
  size: AVATAR_LARGE,
  borderWidth: 6,
  backgroundColor: theme.colors.aquamarineDark,
  children: <Profile size={48} color={theme.colors.white} />,
}

export const WithCustomImage = Template.bind({})
WithCustomImage.args = {
  size: AVATAR_LARGE,
  borderWidth: 6,
  children: (
    <DefaultAvatar>
      <BicolorProfile size={35} color={theme.colors.white} color2={theme.colors.white} />
    </DefaultAvatar>
  ),
}

export const Square = Template.bind({})
Square.args = {
  size: AVATAR_LARGE,
  rounded: false,
  borderWidth: 6,
  backgroundColor: theme.colors.coralLight,
  children: <Typo.Title1>M.M</Typo.Title1>,
}
