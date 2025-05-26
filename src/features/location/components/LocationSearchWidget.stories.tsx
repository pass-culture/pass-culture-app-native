import { NavigationContainer } from '@react-navigation/native'
import type { Meta } from '@storybook/react'
import React from 'react'

import { LocationSearchWidget } from 'features/location/components/LocationSearchWidget'
import { SearchWrapper } from 'features/search/context/SearchWrapper'

const meta: Meta<typeof LocationSearchWidget> = {
  title: 'Features/Location/LocationSearchWidget',
  component: LocationSearchWidget,
  decorators: [
    (Story) => (
      <NavigationContainer>
        <SearchWrapper>
          <Story />
        </SearchWrapper>
      </NavigationContainer>
    ),
  ],
}
export default meta

const Template = () => <LocationSearchWidget />

export const Default = {
  name: 'LocationSearchWidget',
  render: () => Template(),
}
