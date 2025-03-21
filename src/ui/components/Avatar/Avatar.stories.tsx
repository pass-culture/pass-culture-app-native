import { ComponentMeta } from '@storybook/react'
import React from 'react'

import { theme } from 'theme'
import { DefaultAvatar } from 'ui/components/Avatar/DefaultAvatar'
import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'
import { BicolorProfile } from 'ui/svg/icons/BicolorProfile'
import { Profile } from 'ui/svg/icons/Profile'
import { Typo } from 'ui/theme'
import { AVATAR_LARGE, AVATAR_MEDIUM, AVATAR_SMALL, AVATAR_XSMALL } from 'ui/theme/constants'

import { Avatar } from './Avatar'

const meta: ComponentMeta<typeof Avatar> = {
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
      backgroundColor: theme.colors.attentionLight,
      children: <Typo.Title3>M</Typo.Title3>,
    },
  },
  {
    label: 'Avatar large',
    props: {
      size: AVATAR_LARGE,
      children: <Profile size={40} />,
    },
  },
  {
    label: 'Avatar with borders',
    props: {
      size: AVATAR_LARGE,
      borderWidth: 6,
      backgroundColor: theme.colors.aquamarineDark,
      children: <Profile size={48} color={theme.colors.white} />,
    },
  },
  {
    label: 'Avatar with custom images',
    props: {
      size: AVATAR_LARGE,
      borderWidth: 6,
      children: (
        <DefaultAvatar>
          <BicolorProfile size={35} color={theme.colors.white} color2={theme.colors.white} />
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
      backgroundColor: theme.colors.coralLight,
      children: <Typo.Title1>M.M</Typo.Title1>,
    },
  },
]

const Template: VariantsStory<typeof Avatar> = (args) => (
  <VariantsTemplate variants={variantConfig} Component={Avatar} defaultProps={{ ...args }} />
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'Avatar'
