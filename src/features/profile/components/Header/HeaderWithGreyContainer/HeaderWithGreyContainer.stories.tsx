import { NavigationContainer } from '@react-navigation/native'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'
import styled from 'styled-components/native'

import { formatToSlashedFrenchDate } from 'libs/dates'
import { Typo } from 'ui/theme'

import { HeaderWithGreyContainer } from './HeaderWithGreyContainer'

export default {
  title: 'features/Profile/HeaderWithGreyContainer',
  component: HeaderWithGreyContainer,
  decorators: [
    (Story) => (
      <NavigationContainer>
        <Story />
      </NavigationContainer>
    ),
  ],
} as ComponentMeta<typeof HeaderWithGreyContainer>

const Template: ComponentStory<typeof HeaderWithGreyContainer> = (props) => (
  <HeaderWithGreyContainer {...props} />
)

export const WithTitle = Template.bind({})
WithTitle.args = {
  title: 'Jean Dubois',
}

export const WithStringSubtitle = Template.bind({})
WithStringSubtitle.args = {
  title: 'Jean Dubois',
  subtitle: 'Tu as entre 15 et 18 ans\u00a0?',
}

const Row = styled.View({
  flexDirection: 'row',
  flexWrap: 'wrap',
})
export const WithComponentAsSubtitle = Template.bind({})
WithComponentAsSubtitle.args = {
  title: 'Jean Dubois',
  subtitle: (
    <Row>
      <Typo.Body>Profite de ton crédit jusqu’au&nbsp;</Typo.Body>
      <Typo.ButtonText>{formatToSlashedFrenchDate('2023-02-16T17:16:04.735235')}</Typo.ButtonText>
    </Row>
  ),
}

export const WithLargeContent = Template.bind({})
WithLargeContent.args = {
  title: 'Jean Dubois',
  subtitle: 'Tu as entre 15 et 18 ans\u00a0?',
  children: (
    <Typo.Body>
      Lorem ipsum dolor, sit amet consectetur adipisicing elit. Porro molestiae laudantium
      voluptatibus accusamus aperiam maiores culpa sint repellendus nobis quisquam minus totam esse
      neque eum soluta, illum, labore, distinctio asperiores?
    </Typo.Body>
  ),
}

export const WithSmallContent = Template.bind({})
WithSmallContent.args = {
  title: 'Jean Dubois',
  subtitle: 'Tu as entre 15 et 18 ans\u00a0?',
  children: <Typo.Body>Lorem ipsum dolor, sit amet consectetur</Typo.Body>,
}
