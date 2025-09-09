import type { Meta } from '@storybook/react'
import React from 'react'

import { videoModuleFixture } from 'features/home/fixtures/videoModule.fixture'
import { ReactQueryClientProvider } from 'libs/react-query/ReactQueryClientProvider'

import { VideoModule } from './VideoModule'

const meta: Meta<typeof VideoModule> = {
  title: 'Features/home/VideoModule',
  component: VideoModule,
  decorators: [
    (Story: React.ComponentType) => (
      <ReactQueryClientProvider>
        <Story />
      </ReactQueryClientProvider>
    ),
  ],
}
export default meta

const Template = (props: React.ComponentProps<typeof VideoModule>) => <VideoModule {...props} />

const defaultArgs = {
  ...videoModuleFixture,
  index: 0,
  homeEntryId: 'home-entry-id',
  shouldShowModal: false,
}

export const Default = () => Template(defaultArgs)

export const WithLongVideoTitle = () =>
  Template({
    ...defaultArgs,
    videoTitle:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  })
