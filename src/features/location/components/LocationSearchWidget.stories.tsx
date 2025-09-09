import type { Meta } from '@storybook/react-vite'
import React from 'react'

import { LocationSearchWidget } from 'features/location/components/LocationSearchWidget'
import { SearchWrapper } from 'features/search/context/SearchWrapper'

const meta: Meta<typeof LocationSearchWidget> = {
  title: 'Features/Location/LocationSearchWidget',
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

const Template = () => <LocationSearchWidget />

export const Default = {
  name: 'LocationSearchWidget',
  render: () => Template(),
}
