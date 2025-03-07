import { NavigationContainer } from '@react-navigation/native'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import { LocationSearchWidget } from 'features/location/components/LocationSearchWidget'
import { SearchWrapper } from 'features/search/context/SearchWrapper'

const meta: ComponentMeta<typeof LocationSearchWidget> = {
  title: 'features/location/LocationSearchWidget',
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

const Template: ComponentStory<typeof LocationSearchWidget> = () => <LocationSearchWidget />

export const Default = Template.bind({})
Default.storyName = 'LocationSearchWidget'
