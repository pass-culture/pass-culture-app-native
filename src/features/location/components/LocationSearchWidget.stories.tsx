import { NavigationContainer } from '@react-navigation/native'
import { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { LocationSearchWidget } from 'features/location/components/LocationSearchWidget'
import { SearchWrapper } from 'features/search/context/SearchWrapper'

const meta: Meta<typeof LocationSearchWidget> = {
  title: 'Features/Location/LocationSearchWidget',
  component: LocationSearchWidget,
  decorators: [
    (Story) => (
      <NavigationContainer>
        <Story />
      </NavigationContainer>
    ),
    (Story) => (
      <SearchWrapper>
        <Story />
      </SearchWrapper>
    ),
  ],
}
export default meta

const Template: StoryObj<typeof LocationSearchWidget> = () => <LocationSearchWidget />

export const Default = Template.bind({})
Default.storyName = 'LocationSearchWidget'
