import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { venueWithDetailedAccessibilityInfo } from 'features/venue/fixtures/venueWithDetailedAccessibilityInfo'

import { DetailedAccessibilityInfo } from './DetailedAccessibilityInfo'

const meta: ComponentMeta<typeof DetailedAccessibilityInfo> = {
  title: 'ui/accessibility/DetailedAccessibilityInfo',
  component: DetailedAccessibilityInfo,
}
export default meta

const Template: ComponentStory<typeof DetailedAccessibilityInfo> = (props) => (
  <DetailedAccessibilityInfo {...props} />
)

export const Default = Template.bind({})
Default.args = {
  url: 'fakeUrl',
  data: venueWithDetailedAccessibilityInfo.externalAccessibilityData,
}
