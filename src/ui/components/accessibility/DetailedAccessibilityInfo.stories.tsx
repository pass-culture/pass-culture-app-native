import { StoryObj, Meta } from '@storybook/react'
import React from 'react'

import { venueDataTest } from 'features/venue/fixtures/venueDataTest'

import { DetailedAccessibilityInfo } from './DetailedAccessibilityInfo'

const meta: Meta<typeof DetailedAccessibilityInfo> = {
  title: 'ui/accessibility/DetailedAccessibilityInfo',
  component: DetailedAccessibilityInfo,
}
export default meta

const Template: StoryObj<typeof DetailedAccessibilityInfo> = (props) => (
  <DetailedAccessibilityInfo {...props} />
)

export const Default = Template.bind({})
Default.storyName = 'DetailedAccessibilityInfo'
Default.args = {
  url: 'fakeUrl',
  accessibilities: venueDataTest.externalAccessibilityData,
}
