import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { venueDataTest } from 'features/venue/fixtures/venueDataTest'

import { DetailedAccessibilityInfo } from './DetailedAccessibilityInfo'

const meta: Meta<typeof DetailedAccessibilityInfo> = {
  title: 'ui/accessibility/DetailedAccessibilityInfo',
  component: DetailedAccessibilityInfo,
}
export default meta

type Story = StoryObj<typeof DetailedAccessibilityInfo>

export const Default: Story = {
  render: (props) => <DetailedAccessibilityInfo {...props} />,
  name: 'DetailedAccessibilityInfo',
  args: {
    url: 'fakeUrl',
    accessibilities: venueDataTest.externalAccessibilityData,
  },
}
