import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'
import styled from 'styled-components/native'

import { selectArgTypeFromObject } from 'libs/storybook/selectArgTypeFromObject'
import { Bell } from 'ui/svg/icons/Bell'
import { Idea } from 'ui/svg/icons/Idea'
import { Typo } from 'ui/theme'

import { BannerWithBackground } from './BannerWithBackground'

export default {
  title: 'ui/BannerWithBackground',
  component: BannerWithBackground,
  argTypes: {
    leftIcon: selectArgTypeFromObject({
      Bell,
      Idea,
      NoIcon: undefined,
    }),
    rightIcon: selectArgTypeFromObject({
      Bell,
      Idea,
      NoIcon: undefined,
    }),
  },
} as ComponentMeta<typeof BannerWithBackground>

const Template: ComponentStory<typeof BannerWithBackground> = (props) => (
  <BannerWithBackground {...props} />
)

const TextComponent = () => <StyledBody>Banner text</StyledBody>

export const Default = Template.bind({})
Default.args = {
  children: <TextComponent />,
}

export const WithCustomRightIcon = Template.bind({})
WithCustomRightIcon.args = {
  children: <TextComponent />,
  rightIcon: Bell,
}

export const WithLeftIcon = Template.bind({})
WithLeftIcon.args = {
  children: <TextComponent />,
  leftIcon: Idea,
}

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.white,
}))
