import type { Meta } from '@storybook/react-vite'
import React from 'react'

import { LocationWidgetBadge } from 'features/location/components/LocationWidgetBadge'
import { SearchWrapper } from 'features/search/context/SearchWrapper'

const meta: Meta<typeof LocationWidgetBadge> = {
  title: 'Features/Location/LocationWidgetBadge',
  component: LocationWidgetBadge,
  decorators: [
    (Story) => (
      <SearchWrapper>
        <Story />
      </SearchWrapper>
    ),
  ],
}
export default meta

const Template = () => <LocationWidgetBadge />

export const Default = {
  name: 'LocationWidgetBadge',
  render: () => Template(),
}
