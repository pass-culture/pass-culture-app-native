import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'
import styled from 'styled-components/native'

import { Typo } from 'ui/theme'

import { StoryViewport } from './StoryViewport'

export default {
  title: 'meta/Viewport',
  component: StoryViewport.SmallPhone,
} as ComponentMeta<typeof StoryViewport.SmallPhone>

const Background = styled.View({
  zIndex: -1,
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  backgroundImage: 'linear-gradient(to bottom, hsl(275deg 73% 57%), hsl(225deg 73% 57%))',
})

export const SmallPhone: ComponentStory<typeof StoryViewport.SmallPhone> = ({
  children,
  ...props
}) => (
  <StoryViewport.SmallPhone {...props}>
    <Background />
    <Typo.Body>{children}</Typo.Body>
  </StoryViewport.SmallPhone>
)
SmallPhone.args = {
  children: 'Some content',
}

export const Phone: ComponentStory<typeof StoryViewport.Phone> = ({ children, ...props }) => (
  <StoryViewport.Phone {...props}>
    <Background />
    <Typo.Body>{children}</Typo.Body>
  </StoryViewport.Phone>
)
Phone.args = {
  children: 'Some content',
}

export const Tablet: ComponentStory<typeof StoryViewport.Tablet> = ({ children, ...props }) => (
  <StoryViewport.Tablet {...props}>
    <Background />
    <Typo.Body>{children}</Typo.Body>
  </StoryViewport.Tablet>
)
Tablet.args = {
  children: 'Some content',
}

export const Desktop: ComponentStory<typeof StoryViewport.Desktop> = ({ children, ...props }) => (
  <StoryViewport.Desktop {...props}>
    <Background />
    <Typo.Body>{children}</Typo.Body>
  </StoryViewport.Desktop>
)
Desktop.args = {
  children: 'Some content',
}
