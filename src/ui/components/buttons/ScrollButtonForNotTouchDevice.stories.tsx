import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { selectArgTypeFromObject } from 'libs/storybook/selectArgTypeFromObject'
import { Spacer } from 'ui/components/spacer/Spacer'
import { StoryContainer } from 'ui/storybook/StoryContainer'
import { BicolorArrowLeft } from 'ui/svg/icons/BicolorArrowLeft'
import { BicolorArrowRight } from 'ui/svg/icons/BicolorArrowRight'

import { ScrollButtonForNotTouchDevice } from './ScrollButtonForNotTouchDevice'

export default {
  title: 'ui/buttons/ScrollButtonForNotTouchDevice',
  component: ScrollButtonForNotTouchDevice,
  decorators: [
    (Story) => (
      <StoryContainer withBackground>
        <Spacer.Column numberOfSpaces={2} />
        <Story />
        <Spacer.Column numberOfSpaces={2} />
      </StoryContainer>
    ),
  ],
  argTypes: {
    horizontalAlign: selectArgTypeFromObject({
      left: 'left',
      right: 'right',
    }),
  },
} as ComponentMeta<typeof ScrollButtonForNotTouchDevice>

const Template: ComponentStory<typeof ScrollButtonForNotTouchDevice> = (args) => (
  <ScrollButtonForNotTouchDevice {...args} />
)

export const WithArrowLeft = Template.bind({})
WithArrowLeft.args = {
  horizontalAlign: 'left',
  children: <BicolorArrowLeft />,
}
WithArrowLeft.parameters = {
  docs: {
    source: {
      code: `<ScrollButtonForNotTouchDevice horizontalAlign="left">
      <BicolorArrowLeft />
      </ScrollButtonForNotTouchDevice>`,
    },
  },
}

export const WithArrowRight = Template.bind({})
WithArrowRight.args = {
  horizontalAlign: 'right',
  children: <BicolorArrowRight />,
}
WithArrowRight.parameters = {
  docs: {
    source: {
      code: `<ScrollButtonForNotTouchDevice horizontalAlign="right">
      <BicolorArrowRight />
      </ScrollButtonForNotTouchDevice>`,
    },
  },
}
