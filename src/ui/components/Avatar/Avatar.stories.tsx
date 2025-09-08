import type { Meta } from '@storybook/react-vite'
import React from 'react'

import { theme } from 'theme'
import { DefaultAvatar } from 'ui/components/Avatar/DefaultAvatar'
import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'
import { Profile } from 'ui/svg/icons/Profile'
import { ProfileFilled } from 'ui/svg/icons/ProfileFilled'
import { Typo } from 'ui/theme'
import { AVATAR_LARGE, AVATAR_MEDIUM, AVATAR_SMALL, AVATAR_XSMALL } from 'ui/theme/constants'

import { Avatar } from './Avatar'

const meta: Meta<typeof Avatar> = {
  title: 'ui/Avatar',
  component: Avatar,
}

export default meta

const variantConfig: Variants<typeof Avatar> = [
  {
    label: 'Avatar xsmall',
    props: { size: AVATAR_XSMALL, children: <Typo.Title3>M</Typo.Title3> },
  },
  {
    label: 'Avatar small',
    props: { size: AVATAR_SMALL, children: <Typo.Title3>M</Typo.Title3> },
  },
  {
    label: 'Avatar medium',
    props: {
      size: AVATAR_MEDIUM,
      backgroundColor: theme.designSystem.color.background.brandPrimary,
      children: <Typo.Title3>M</Typo.Title3>,
    },
  },
  {
    label: 'Avatar large',
    props: {
      size: AVATAR_LARGE,
      children: <ProfileFilled size={40} />,
    },
  },
  {
    label: 'Avatar with borders',
    props: {
      size: AVATAR_LARGE,
      borderWidth: 6,
      backgroundColor: theme.designSystem.color.background.brandPrimary,
      children: <ProfileFilled size={48} color={theme.designSystem.color.icon.lockedInverted} />,
    },
  },
  {
    label: 'Avatar with custom images',
    props: {
      size: AVATAR_LARGE,
      borderWidth: 6,
      children: (
        <DefaultAvatar>
          <Profile size={35} color={theme.designSystem.color.icon.lockedInverted} />
        </DefaultAvatar>
      ),
    },
  },
  {
    label: 'Avatar square',
    props: {
      size: AVATAR_LARGE,
      rounded: false,
      borderWidth: 6,
      backgroundColor: theme.designSystem.color.background.brandPrimary,
      children: <Typo.Title1>M.M</Typo.Title1>,
    },
  },
  {
    label: 'Avatar square with border radius',
    props: {
      size: AVATAR_LARGE,
      rounded: false,
      backgroundColor: theme.designSystem.color.background.brandPrimary,
      borderRadius: theme.designSystem.size.borderRadius.m,
      children: <Typo.Title1>M.M</Typo.Title1>,
    },
  },
]

export const Template: VariantsStory<typeof Avatar> = {
  name: 'Avatar',
  render: (props) => (
    <VariantsTemplate variants={variantConfig} Component={Avatar} defaultProps={props} />
  ),
}
