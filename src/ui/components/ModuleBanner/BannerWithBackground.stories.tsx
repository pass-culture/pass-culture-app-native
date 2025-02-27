import { Meta } from '@storybook/react'
import React from 'react'
import styled from 'styled-components/native'

import { SHARE_APP_BANNER_IMAGE_SOURCE } from 'features/share/components/shareAppBannerImage'
import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'
import { Bell } from 'ui/svg/icons/Bell'
import { TypoDS } from 'ui/theme'

import { BannerWithBackground } from './BannerWithBackground'

const meta: Meta<typeof BannerWithBackground> = {
  title: 'ui/banners/BannerWithBackground',
  component: BannerWithBackground,
}
export default meta

const TextComponent = () => <StyledBody>Banner text</StyledBody>
const StyledBody = styled(TypoDS.Body)(({ theme }) => ({
  color: theme.colors.white,
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

const Template: VariantsStory<typeof BannerWithBackground> = (args) => (
  <VariantsTemplate variants={variantConfig} Component={BannerWithBackground} defaultProps={args} />
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'BannerWithBackground'
