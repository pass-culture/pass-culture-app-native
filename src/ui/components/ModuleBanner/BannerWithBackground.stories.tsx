import type { Meta } from '@storybook/react'
import React from 'react'
import styled from 'styled-components/native'

import { SHARE_APP_BANNER_IMAGE_SOURCE } from 'features/share/components/shareAppBannerImage'
import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'
import { Bell } from 'ui/svg/icons/Bell'
import { Typo } from 'ui/theme'

import { BannerWithBackground } from './BannerWithBackground'

const meta: Meta<typeof BannerWithBackground> = {
  title: 'ui/banners/BannerWithBackground',
  component: BannerWithBackground,
}
export default meta

const TextComponent = () => <StyledBody>Banner text</StyledBody>
const StyledBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.designSystem.color.text.lockedInverted,
}))

const variantConfig: Variants<typeof BannerWithBackground> = [
  {
    label: 'BannerWithBackground default',
    props: { children: <TextComponent /> },
  },
  {
    label: 'BannerWithBackground with custom image',
    props: { children: <TextComponent />, backgroundSource: SHARE_APP_BANNER_IMAGE_SOURCE },
  },
  {
    label: 'BannerWithBackground with right icon',
    props: { children: <TextComponent />, rightIcon: Bell },
  },
  {
    label: 'BannerWithBackground with left icon',
    props: { children: <TextComponent />, leftIcon: Bell },
  },
]

export const Template: VariantsStory<typeof BannerWithBackground> = {
  name: 'BannerWithBackground',
  render: (props) => (
    <VariantsTemplate
      variants={variantConfig}
      Component={BannerWithBackground}
      defaultProps={props}
    />
  ),
}
