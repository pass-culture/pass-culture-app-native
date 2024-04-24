import { NavigationContainer } from '@react-navigation/native'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import styled from 'styled-components/native'

import { theme } from 'theme'
import { SubcategoryButton } from 'ui/components/buttons/SubcategoryButton/SubcategoryButton'
import { getSpacing } from 'ui/theme'
const meta: ComponentMeta<typeof SubcategoryButton> = {
  title: 'ui/buttons/SubcategoryButton',
  component: SubcategoryButton,
  decorators: [
    (Story) => (
      <NavigationContainer>
        <Story />
      </NavigationContainer>
    ),
  ],
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
  label: label,
  accessibilityLabel: label,
  colors: [theme.colors.aquamarineLight, theme.colors.aquamarine],
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
