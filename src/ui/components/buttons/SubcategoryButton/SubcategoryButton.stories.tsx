import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import styled from 'styled-components/native'

import { SearchWrapper } from 'features/search/context/SearchWrapper'
import { PLACEHOLDER_DATA } from 'libs/subcategories/placeholderData'
import { theme } from 'theme'
import { SubcategoryButton } from 'ui/components/buttons/SubcategoryButton/SubcategoryButton'
import { getSpacing } from 'ui/theme'

const Stack = createStackNavigator()

const meta: ComponentMeta<typeof SubcategoryButton> = {
  title: 'ui/buttons/SubcategoryButton',
  component: SubcategoryButton,
  decorators: [
    (Story) => (
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{ headerShown: false, cardStyle: { flexBasis: 'content' } }}>
          <Stack.Screen
            name="SubcategoryButton"
            component={() => (
              <SearchWrapper>
                <Story />
              </SearchWrapper>
            )}
          />
        </Stack.Navigator>
      </NavigationContainer>
    ),
  ],
  parameters: {
    useQuery: {
      subcategories: PLACEHOLDER_DATA.subcategories,
    },
  },
}
export default meta

const Template: ComponentStory<typeof SubcategoryButton> = (props) => (
  <Container>
    <SubcategoryButton {...props} />
  </Container>
)

const label = 'Société & Politique'

export const Default = Template.bind({})
Default.args = {
  label,
  colors: [theme.colors.aquamarine, theme.colors.aquamarineDark],
}
const Container = styled.View({
  margin: getSpacing(4),
  width: '100%',
  height: '100%',
  flexDirection: 'row',
  gap: getSpacing(4),
  justifyContent: 'stretch',
  justifyItems: 'stretch',
})
