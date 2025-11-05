import type { Meta } from '@storybook/react-vite'
import React from 'react'

import { LocationSearchWidget } from 'features/location/components/LocationSearchWidget'
import { LocationSearchWidgetBadge } from 'features/location/components/LocationSearchWidgetBadge'
import { SearchWrapper } from 'features/search/context/SearchWrapper'

const meta: Meta<typeof LocationSearchWidget> = {
  title: 'Features/Location/LocationSearchWidgetBadge',
  component: LocationSearchWidget,
  decorators: [
    (Story) => (
      <SearchWrapper>
        <Story />
      </SearchWrapper>
    ),
  ],
}
export default meta

const Template = () => <LocationSearchWidgetBadge />

export const Default = {
  name: 'LocationSearchWidget',
  render: () => Template(),
}
