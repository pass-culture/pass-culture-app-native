import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { videoModuleFixture } from 'features/home/fixtures/videoModule.fixture'

import { VideoModule } from './VideoModule'

export default {
  title: 'VideoModule',
  component: VideoModule,
} as ComponentMeta<typeof VideoModule>

const Template: ComponentStory<typeof VideoModule> = (props) => <VideoModule {...props} />

const defaultArgs = videoModuleFixture

export const Default = Template.bind({})
Default.args = defaultArgs

export const WithLongVideoTitle = Template.bind({})
WithLongVideoTitle.args = {
  ...defaultArgs,
  videoTitle:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
}
