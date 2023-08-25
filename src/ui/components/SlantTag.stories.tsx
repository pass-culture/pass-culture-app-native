import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'
import styled from 'styled-components/native'

import { getSpacing } from 'ui/theme'

import { SlantTag } from './SlantTag'

const meta: ComponentMeta<typeof SlantTag> = {
  title: 'ui/tags/SlantTag',
  component: SlantTag,
}
export default meta

const Template: ComponentStory<typeof SlantTag> = (props) => (
  <SlantTagWrapper>
    <SlantTag {...props} />
  </SlantTagWrapper>
)

export const Default = Template.bind({})
Default.args = {
  text: 'Simple SlantTag',
}

export const WithSlantAngle = Template.bind({})
WithSlantAngle.args = {
  text: 'Tag adapts to container size',
  slantAngle: -2,
}

export const WithWidth = Template.bind({})
WithWidth.args = {
  text: 'Tag with fixed with',
  width: getSpacing(35),
}

export const WithHeight = Template.bind({})
WithHeight.args = {
  text: 'Tag with fixed height',
  height: getSpacing(10),
}

const SlantTagWrapper = styled.View({
  maxWidth: 300,
})
